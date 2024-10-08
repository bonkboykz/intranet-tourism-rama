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

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, string $destination)
    {
        $this->user = $user;
        $this->destination = $destination;
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
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' created a new post in ' . $this->destination,
        ]);
    }
}
