<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Modules\Department\Models\Department;
use Modules\User\Models\User;

class DepartmentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $department;

    public function __construct(User $user, Department $department)
    {
        $this->user = $user;
        $this->department = $department;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->user->name . " added you to the department " . $this->department->name,
            'department_id' => $this->department->id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->user->name . " added you to the department " . $this->department->name,
            'department_id' => $this->department->id,
        ]);
    }
}
