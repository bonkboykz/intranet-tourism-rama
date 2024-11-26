<?php

namespace App\Jobs;

use App\Notifications\AdminCreatedPostNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;
use Modules\Communities\Models\Community;
use Modules\User\Models\User;

class SuperadminCreatePostInCommunity implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $user_id, public $community_id)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        $community = Community::with('members')->find($this->community_id);
        $currentUser = User::where('id', $this->user_id)->firstOrFail();

        $members = $community->members;
        Notification::send($members, new AdminCreatedPostNotification($currentUser, $community->name));
    }
}
