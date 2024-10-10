<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class AdminCreatedPostNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;

    public string $destination;
    public $user_avatar;


    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, string $destination)
    {
        $this->user = $user;
        $this->destination = $destination;

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
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }


    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->user->name . ' created a new post in ' . $this->destination,
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' created a new post in ' . $this->destination,
            'user_avatar' => $this->user_avatar
        ]);
    }
}
