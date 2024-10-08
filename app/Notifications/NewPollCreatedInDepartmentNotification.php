<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewPollCreatedInDepartmentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $department_id;


    public function __construct($department_id)
    {
        $this->department_id = $department_id;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'New Poll created in department',
            'department_id' => $this->department_id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return [
            'message' => 'New Poll created in department',
            'department_id' => $this->department_id,
        ];
    }
}
