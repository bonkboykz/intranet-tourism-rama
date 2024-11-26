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
    public function __construct(public $user_id, public $department_id)
    {
    }


    public function handle()
    {

        $currentUser = User::find($this->user_id);

        $department = Department::with('members')->find($this->department_id);

        $members = $department->members;
        Notification::send($members, new AdminCreatedPostNotification($currentUser, $department->name));


    }
}
