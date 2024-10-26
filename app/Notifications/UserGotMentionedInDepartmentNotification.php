<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class UserGotMentionedInDepartmentNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public $user;
    public $department_id;

    public function __construct($user, $department_id) {
        $this->user = $user;
        $this->department_id = $department_id;
    }

    public function via($notifiable) {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->user->name . 'mentioned you in department',
            'department_id' => $this->department_id,
        ];
    }

    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => $this->user->name . 'mentioned you in department',
            'department_id' => $this->department_id,
        ]);
    }
}
