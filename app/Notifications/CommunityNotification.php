<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommunityNotification extends Notification
{
    use Queueable;

    protected $actor;      // The user who performed the action
    protected $community;  // The community involved
    protected $action;     // The action performed (e.g., 'added', 'removed')

    public function __construct($actor, $community, $action)
    {
        $this->actor = $actor;
        $this->community = $community;
        $this->action = $action;
    }

    public function via($notifiable)
    {
        return ['database', 'mail']; // Specify notification channels
    }

    public function toArray($notifiable)
    {
        // Определяем сообщение в зависимости от действия
        $actionMessage = $this->action === 'added'
            ? 'added you to the community'
            : 'removed you from the community';

        return [
            'actor' => $this->actor->name,
            'community' => $this->community->name,
            'message' => $this->actor->name . ' has ' . $actionMessage . ' ' . $this->community->name,
        ];
    }


}
