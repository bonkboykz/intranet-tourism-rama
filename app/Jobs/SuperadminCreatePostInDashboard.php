<?php

namespace App\Jobs;

use App\Notifications\AdminCreatedPostNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Modules\User\Models\User;
use Symfony\Component\Console\Output\ConsoleOutput;

class SuperadminCreatePostInDashboard implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */

    public $user_id;

    public function __construct($user_id)
    {
        $this->user_id = $user_id;
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        $users = User::all();
        $currentUser = User::where('id', $this->user_id)->firstOrFail();
        Notification::send($users, new AdminCreatedPostNotification($currentUser, 'dashboard'));


    }
}
