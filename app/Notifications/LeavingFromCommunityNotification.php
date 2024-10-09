<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class LeavingFromCommunityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $community_id;
    public $user;
    /**
     * Create a new notification instance.
     */
    public function __construct($community_id, User $user)
    {
        $this->community_id = $community_id;
        $this->user = $user;
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
            'message' => $this->user->name . ' has leaved the community',
            'community_id' => $this->community_id
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage {
        return new BroadcastMessage([
            'message' => $this->user->name . ' has leaved the community',
            'community_id' => $this->community_id
        ]);
    }
}
