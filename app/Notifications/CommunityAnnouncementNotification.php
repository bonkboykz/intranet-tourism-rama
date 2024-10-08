<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\Communities\Models\Community;
use Modules\User\Models\User;

class CommunityAnnouncementNotification extends Notification implements ShouldQueue
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
            'message' => $this->user->name . ' made an announcement in ' . $this->community->name,
            'community_id' => $this->community->id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' made an announcement in ' . $this->community->name,
            'community_d' => $this->community->id,
        ]);
    }
}
