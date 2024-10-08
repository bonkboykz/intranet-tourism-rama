<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class CommunityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $actor;
    protected $community;
    protected $action;

    public function __construct($actor, $community, $action)
    {
        $this->actor = $actor;
        $this->community = $community;
        $this->action = $action;
    }

    public function via($notifiable)
    {
        \Log::info("Sending notification to user: {$notifiable->id}");
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        $actionMessage = match($this->action) {
            'added' => 'added you to the community',
            'removed' => 'removed you from the community',
            'archived' => 'archived the community',
            'unarchived' => 'unarchived the community',
            'revoke' => 'deleted the community',
            default => 'performed an action on the community'
        };

        return [
            'actor' => $this->actor->name,
            'community' => $this->community->name,
            'message' => $this->actor->name . ' has ' . $actionMessage . ' ' . $this->community->name,
        ];
    }

    public function toBroadcast($notifiable)
    {
        $actionMessage = match($this->action) {
            'added' => 'added you to the community',
            'removed' => 'removed you from the community',
            'archived' => 'archived the community',
            'unarchived' => 'unarchived the community',
            'revoke' => 'deleted the community',
            default => 'performed an action on the community'
        };

        return new BroadcastMessage([
            'actor' => $this->actor->name,
            'community' => $this->community->name,
            'message' => $this->actor->name . ' has ' . $actionMessage . ' ' . $this->community->name,
        ]);
    }
}
