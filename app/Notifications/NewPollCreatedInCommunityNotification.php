<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class NewPollCreatedInCommunityNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public $community_id;

    public function __construct($community_id)
    {
        $this->community_id = $community_id;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'New Poll created in department',
            'department_id' => $this->community_id,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return [
            'message' => 'New Poll created in department',
            'department_id' => $this->community_id,
        ];
    }
}
