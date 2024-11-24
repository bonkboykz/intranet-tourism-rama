<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewPollCreatedInDepartmentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $department_id;
    public $user;
    public $user_avatar;


    public function __construct($department_id, $user)
    {
        $this->department_id = $department_id;
        if ($this->user->profile->image) {
            $this->user_avatar = $this->user->profile->image;
        } elseif ($this->user->profile->staff_image) {
            $this->user_avatar = $this->user->profile->staff_image;
        } else {
            $this->user_avatar = 'https://ui-avatars.com/api/?name=' . $this->user->name . '&color=7F9CF5&background=EBF4FF';
        }
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
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return [
            'message' => 'New Poll created in department',
            'department_id' => $this->department_id,
            'user_avatar' => $this->user_avatar,
        ];
    }
}
