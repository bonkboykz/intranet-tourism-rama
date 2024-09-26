<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Laravel\Socialite\Facades\Socialite;
use Modules\Auth\Http\Requests\LoginRequest;
use Modules\Auth\Models\SocialAccount;

class SocialLoginController extends Controller
{
    public function redirect($driver)
    {
        return Socialite::driver($driver)->redirect();
    }

    public function callback($driver)
    {
        $socialiteUser = Socialite::driver($driver)->user();
        $user = User::where('email', strtolower($socialiteUser->getEmail()))->first();
        DB::beginTransaction();
        try {
            if (!$user) {
                $user = User::create([
                    'name' => $socialiteUser->name,
                    'email' => strtolower($socialiteUser->getEmail()),
                    'password' => bcrypt('password'),
                ]);
                $user->assignRole('user');
            }

            SocialAccount::query()->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'provider' => $driver,
                    'provider_user_id' => $socialiteUser->getId()
                ],
                [
                    'token' => $socialiteUser->token,
                    'token_secret' => $socialiteUser->tokenSecret,
                    'refresh_token' => $socialiteUser->refreshToken,
                    'expires_in' => $socialiteUser->expiresIn,
                ]
            );

            auth()->login($user);
            DB::commit();
            return redirect('/');
        } catch (\Throwable $th) {
            DB::rollback();
            throw $th;
        }
    }

    public function logout(Request $request, $driver)
    {
        auth()->logout();
        session()->flush();
        $azureLogoutUrl = Socialite::driver($driver)->getLogoutUrl(route('login'));
        return redirect($azureLogoutUrl);
    }
}
