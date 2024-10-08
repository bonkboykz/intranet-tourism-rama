<?php

namespace App\Notifications;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;
use Illuminate\Notifications\Messages\BroadcastMessage;

class AssigningAdminCommunityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $community_id;

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


    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => $this->user->name . ' was assigned as an admin in community',
            'community_id' => $this->community_id,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' was assigned as an admin in community',
            'community_id' => $this->community_id,
        ]);
    }

}
