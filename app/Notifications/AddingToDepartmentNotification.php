<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class AddingToDepartmentNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public $department_id;
    public $user;

    public function __construct($department_id, $user) {
        $this->department_id = $department_id;
        $this->user = $user;
    }

    public function via($notifiable) {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable) {
        return [
            'message' => $this->user->name . ' added you to department ',
            'department_id' => $this->department_id,
        ];
    }

    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => $this->user->name .  ' added you to department ',
            'department_id' => $this->department_id,
        ]);
    }

}
