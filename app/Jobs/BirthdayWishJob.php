<?php

namespace App\Jobs;

use App\Notifications\BirthdayWishNotification;
use App\Notifications\SomeonesBirthdayNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Log;
use Modules\Profile\Models\Profile;
use Illuminate\Support\Facades\Notification;
use Modules\User\Models\User;

class BirthdayWishJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Fetch users with today's birthday in a single query
        $birthdayProfiles = Profile::with('user')
            ->whereMonth("dob", now()->month)
            ->whereDay("dob", now()->day)
            ->get();

        // Check if there are any birthdays to process
        if ($birthdayProfiles->isEmpty()) {
            return;
        }

        // Notify birthday users and collect users with birthdays for notifying others
        $birthdayUsers = [];
        foreach ($birthdayProfiles as $profile) {
            $user = $profile->user;
            if ($user) {
                // Send birthday wish to the user
                $user->notify(new BirthdayWishNotification($user));
                $birthdayUsers[] = $user;
            }
        }

        // Send notification about each birthday to all other users
        if (!empty($birthdayUsers)) {
            // Fetch all users except those with today's birthdays
            $otherUsers = User::whereNotIn('id', array_column($birthdayUsers, 'id'))->get();

            foreach ($birthdayUsers as $birthdayUser) {
                // Bulk notify all other users about this birthday in a single Notification::send
                Notification::send($otherUsers, new SomeonesBirthdayNotification($birthdayUser));
            }
        }
    }
}
