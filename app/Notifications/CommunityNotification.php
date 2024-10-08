<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Modules\Communities\Models\Community;
use Modules\User\Models\User;

class CommunityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $community;

    public function __construct(User $user, Community $community)
    {
        $this->user = $user;
        $this->community = $community;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->user->name . " added you to the community " . $this->community->name,
            'community_id' => $this->community->id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->user->name . " added you to the community " . $this->community->name,
            'community_id' => $this->community->id,
        ]);
    }
}
