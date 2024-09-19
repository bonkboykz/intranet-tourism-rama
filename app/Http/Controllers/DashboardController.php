<?php

namespace App\Http\Controllers;
use App\Models\ProfileModel;
use Modules\User\Models\User;
use Carbon\Carbon; // Import Carbon for date handling

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user_id = auth()->id();

        // Check if the profile exists for the authenticated user
        $profile = ProfileModel::where('user_id', $user_id)->first();
        $user = User::where('id', $user_id)->first();

        // If the profile does not exist, create a new one
        if (!$profile) {
            $profile = ProfileModel::create([
                'user_id' => $user->id,
                'bio' => $user->name,
            ]);
        }

        return Inertia::render('Dashboard', ['id' => auth()->id()]);
    }

    public function onlinelist()
    {
        return Inertia::render('onlinelist', ['id' => auth()->id()]);
    }
}
