<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class LeavingDepartmentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $department_id;
    public $user;
    public $user_avatar;



    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, $department_id)
    {
        $this->user = $user;
        $this->department_id = $department_id;

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

    public function toDatabase(object $notifiable): array {
        return [
            'message' => $this->user->name . ' has leaved a department.',
            'department_id' => $this->department_id,
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage {
        return new BroadcastMessage([
            'message' => $this->user->name . ' has leaved a department.',
            'department_id' => $this->department_id,
            'user_avatar' => $this->user_avatar,
        ]);
    }

}
