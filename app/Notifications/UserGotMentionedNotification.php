<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class UserGotMentionedNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public $post;
    public $comment_id;
    public $user;


    public function __construct($post, $comment_id, User $user) {
        $this->post = $post;
        $this->user = $user;
        $this->comment_id = $comment_id;
    }

    public function via($notifiable) {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->user->name . ' mentioned you in a post',
            'post_id' => $this->post->id,
            'comment_id' => $this->comment_id,

        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' mentioned you in a post' ,
            'post_id' => $this->post->id,
            'comment_id' => $this->comment_id,
        ]);
    }

}
