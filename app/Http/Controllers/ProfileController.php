<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Modules\User\Models\User;

class ProfileController extends Controller
{
    public function index()
    {
        // dd(auth()->id());
        return Inertia::render('Profile', ['id' => auth()->id()]); // Assuming 'Profile' is the name of your profile view
    }


    public function show($id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('UserDetail', ['user' => $user, 'id' => auth()->id()]);
    }

    public function profileQr($id)
    {
        $user = User::findOrFail($id);
        return $user->vcard;
    }
}
