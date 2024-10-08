<?php

namespace App\Jobs;

use App\Notifications\BirthdayWishNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Modules\Profile\Models\Profile;

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
        Profile::query()->whereMonth("dob", now()->month)->whereDay("dob", now()->month)
            ->chunk(100, function ($birthdayBoy) {
                $user = $birthdayBoy->user;

                $user->notify(new BirthdayWishNotification($user));
            });
    }
}
