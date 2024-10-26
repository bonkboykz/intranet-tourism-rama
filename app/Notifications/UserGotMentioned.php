<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class UserGotMentioned extends Notification implements ShouldQueue
{
    use Queueable;
    public $user;
    public $destination;

    function __construct($user, $destination) {
        $this->user = $user;
        $this->destination = $destination;
    }

    public function via($notifiable) {
        return ['database', 'broadcast'];
    }


    public function toDatabase($notifiable) {
        return [
            'message' => $this->user->name . ' mentioned you in ' . $this->destination,
        ];
    }

    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => $this->user->name . ' mentioned you in ' . $this->destination,
        ]);
    }

}
