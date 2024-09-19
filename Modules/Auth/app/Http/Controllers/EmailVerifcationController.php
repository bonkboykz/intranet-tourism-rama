<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EmailVerifcationController extends Controller
{
    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function verify(Request $request)
    {
        $user = \Modules\User\Models\User::findOrFail($request->id);
        Auth::onceUsingId($user->id);
        if (!hash_equals((string) $request->user()->getKey(), (string) $request->route('id'))) {
            return false;
        }

        if (!hash_equals(sha1($request->user()->getEmailForVerification()), (string) $request->route('hash'))) {
            return false;
        }

        if (!$request->user()->hasVerifiedEmail()) {
            $request->user()->markEmailAsVerified();

            event(new Verified($request->user()));
        }

        return redirect()->away(config('app.frontend_url'));
    }

    public function resendVerification(Request $request, User $user)
    {
        $email = $user ? $user->email : $request->email;
        User::where('email', $email)->firstOrFail()->sendEmailVerificationNotification();

        return response()->noContent();
    }
}
