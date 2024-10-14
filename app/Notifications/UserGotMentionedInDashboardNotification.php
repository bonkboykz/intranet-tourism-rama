<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class UserGotMentionedInDashboardNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public $user;
    public $post;

    function __construct($user, $post) {
        $this->user = $user;
        $this->post = $post;
    }

    public function via($notifiable) {
        return ['database', 'broadcast'];
    }


    public function toDatabase($notifiable) {
        return [
            'message' => $this->user->username . 'mentioned you in' . $this->post->title,
        ];
    }

    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => $this->user->username . 'mentioned you in' . $this->post->title,
        ]);
    }

}
