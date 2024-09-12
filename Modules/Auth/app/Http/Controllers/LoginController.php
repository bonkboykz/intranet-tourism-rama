<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Models\User;
use Illuminate\Http\Request;
use Modules\Auth\Http\Requests\LoginRequest;

class LoginController extends Controller
{
    public function login(LoginRequest $request)
    {
        $request->authenticate();

        $user = User::query()->where('id', auth()->id())->with('roles.permissions')
            ->withModuleRelation('Organisation', 'department')
            ->firstOrFail();

        return response()->json([
            'data' => [
                'hasVerifiedEmail' => $user->hasVerifiedEmail(),
                'token' => $user->createToken(name: 'web', expiresAt: request('remember') ? now()->addDays(7) : null)->plainTextToken,
                'user' => $user->only('id', 'name', 'email'),
                'permissions' => $user->roles->flatMap->permissions->pluck('name')->unique()->toArray(),
            ],
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->hasSession()) {
            auth()->logout();
            session()->invalidate();
            session()->regenerateToken();
        } else {
            $user = User::find(auth()->id());
            $user->currentAccessToken()->delete();
        }

        return response()->noContent();
    }
}
