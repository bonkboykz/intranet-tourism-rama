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
    protected $action;     // The action performed (e.g., 'added')

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
        return [
            'actor' => $this->actor->name,
            'community' => $this->community->name,
            'message' => $this->actor->name . ' ' . $this->action . ' you to the community ' . $this->community->name,
        ];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('You have been added to a community')
            ->line($this->toArray($notifiable)['message']);
    }
}

