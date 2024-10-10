<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DepartmentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;
    protected $department;
    protected $action;
    public $user_avatar;

    public function __construct($user, $department, $action)
    {
        $this->user = $user;
        $this->department = $department;
        $this->action = $action;

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
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "{$this->user->name} was {$this->action} to the department {$this->department->name}.",
            'department_id' => $this->department->id,
            'user_avatar' => $this->user_avatar,
        ];
    }

}
