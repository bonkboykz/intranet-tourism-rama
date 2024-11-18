<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class RemovingFromDepartmentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $department;
    public $user;
    public $user_avatar;

    public function __construct($department, $user)
    {
        $this->department = $department;
        $this->user = $user;

        if ($this->user->profile->image) {
            $this->user_avatar = $this->user->profile->image;
        } elseif ($this->user->profile->staff_image) {
            $this->user_avatar = $this->user->profile->staff_image;
        } else {
            $this->user_avatar = 'https://ui-avatars.com/api/?name=' . $this->user->name . '&color=7F9CF5&background=EBF4FF';
        }
    }

    public function via($notifiable) {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable) {
        return [
            'message' => 'You have left ' . $this->department->name . ' department.',
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => 'You have left ' . $this->department->name . ' department.',
            'user_avatar' => $this->user_avatar,
        ]);
    }
}
