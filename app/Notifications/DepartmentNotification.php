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

    public function __construct($user, $department, $action)
    {
        $this->user = $user;
        $this->department = $department;
        $this->action = $action;
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
        ];
    }

}
