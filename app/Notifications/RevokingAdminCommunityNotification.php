<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class RevokingAdminCommunityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $community_id;

    public $user_avatar;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, $community_id)
    {
        $this->user = $user;
        $this->community_id = $community_id;
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
            'message' => $this->user->name . ' was revoked as an admin in community',
            'community_id' => $this->community_id,
            'user_avatar' => $this->user_avatar,
        ];
    }

    // use toBroadcast function
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' was revoked as an admin in community',
            'community_id' => $this->community_id,
            'user_avatar' => $this->user_avatar,
        ]);
    }
}
