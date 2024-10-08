<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class RevokingAdminDepartmentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $department_id;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, $department_id)
    {
        $this->user = $user;
        $this->department_id = $department_id;
    }


    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    // use toDatabase function
    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => $this->user->name . ' was revoked as an admin in department',
            'department_id' => $this->department_id,
        ];
    }

    // use toBroadcast function
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' was revoked as an admin in department',
            'department_id' => $this->department_id,
        ]);
    }
}
