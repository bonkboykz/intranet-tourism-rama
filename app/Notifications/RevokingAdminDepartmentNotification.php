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
    public $is_admin;
    public $user_avatar;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, $department_id, $is_admin = false)
    {
        $this->user = $user;
        $this->department_id = $department_id;
        $this->is_admin = $is_admin;

        if ($this->user->profile->image) {
            $this->user_avatar = $this->user->profile->image;
        } elseif ($this->user->profile->staff_image) {
            $this->user_avatar = $this->user->profile->staff_image;
        } else {
            $this->user_avatar = 'https://ui-avatars.com/api/?name=' . $this->user->name . '&color=7F9CF5&background=EBF4FF';
        }
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
            'message' => $this->is_admin ? $this->user->name . ' was revoked as an admin in department'
                : 'You were revoked as an admin in department',
            'department_id' => $this->department_id,
            'user_avatar' => $this->user_avatar,
        ];
    }

    // use toBroadcast function
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->is_admin ? $this->user->name . ' was revoked as an admin in department'
                : 'You were revoked as an admin in department',
            'department_id' => $this->department_id,
            'user_avatar' => $this->user_avatar,
        ]);
    }
}
