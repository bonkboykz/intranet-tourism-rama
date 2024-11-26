<?php

namespace App\Jobs;

use App\Notifications\AdminCreatedPostNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Modules\Department\Models\Department;
use Modules\User\Models\User;
use Illuminate\Support\Facades\Notification;


class SuperadminCreatePostInDepartment implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public $user_id) {}


    public function handle()
    {
        $departments = Department::with('members')->get();
        $currentUser = User::find($this->user_id);

        foreach ($departments as $department) {
            $members = $department->members;
            Notification::send($members, new AdminCreatedPostNotification($currentUser, $department->name));
        }


    }
}
