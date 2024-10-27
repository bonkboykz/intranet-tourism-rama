<?php

namespace App\Jobs;

use App\Notifications\BirthdayWishNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Log;
use Modules\Profile\Models\Profile;
use Symfony\Component\Console\Output\ConsoleOutput;

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

        Profile::query()
            ->whereMonth("dob", now()->month)
            ->whereDay("dob", now()->day) // Corrected this line to match the day
            ->chunk(100, function ($birthdayProfiles) {
                foreach ($birthdayProfiles as $profile) {
                    $user = $profile->user;

                    if ($user) {
                        $user->notify(new BirthdayWishNotification($user));
                    }
                }
            });
    }
}
