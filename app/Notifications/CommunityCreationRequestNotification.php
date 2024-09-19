<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;

// This notification informs an admin or superuser when a user requests to create a new community.
class CommunityCreationRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $community;
    public $user;

    public function __construct($community, $user)
    {
        $this->community = $community;
        $this->user = $user;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->user->name . ' has requested to create a new community: ' . $this->community->name,
            'community_id' => $this->community->id,
            'user_id' => $this->user->id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' has requested to create a new community: ' . $this->community->name,
            'community_id' => $this->community->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line($this->user->name . ' has requested to create a new community: ' . $this->community->name)
            ->action('Review Request', url('/communities/' . $this->community->id . '/requests'))
            ->line('Please review the request and take appropriate action.');
    }
}
