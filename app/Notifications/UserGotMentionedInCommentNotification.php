<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class UserGotMentionedInCommentNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public $post;
    public $comment_id;
    public $user;
    public $user_avatar;


    public function __construct($post, $comment_id, User $user) {
        $this->post = $post;
        $this->user = $user;
        $this->comment_id = $comment_id;

        if ($this->user->profile->image) {
            $this->user_avatar = $this->user->profile->image;
        } elseif ($this->user->profile->staff_image) {
            $this->user_avatar = $this->user->profile->staff_image;
        } else {
            $this->user_avatar = 'https://ui-avatars.com/api/?name=' . $this->user->name . '&color=7F9CF5&background=EBF4FF';
        }
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
            'user_avatar' => $this->user_avatar,

        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' mentioned you in a post' ,
            'post_id' => $this->post->id,
            'comment_id' => $this->comment_id,
            'user_avatar' => $this->user_avatar,
        ]);
    }

}
