<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Modules\Posts\Models\Post;
use Modules\User\Models\User;
class CommentNotification extends Notification implements ShouldQueue
{

    use Queueable;

    public $user;
    public $post;
    public $user_avatar;


    public function __construct(User $user, Post $post) {
        $this->user = $user;
        $this->post = $post;

        if ($this->user->profile->image) {
            $this->user_avatar = $this->user->profile->image;
        } elseif ($this->user->profile->staff_image) {
            $this->user_avatar = $this->user->profile->staff_image;
        } else {
            $this->user_avatar = 'https://ui-avatars.com/api/?name=' . $this->user->name . '&color=7F9CF5&background=EBF4FF';
        }
    }


    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable) {
        // Send a notification
        return [
            'message' => $this->user->name . " comment your post.",
            'post_id' => $this->post->id,
            'user_avatar' => $this->user_avatar,
        ];
    }
    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => $this->user->name . " comment your post.",
            'post_id' => $this->post->id,
            'user_avatar' => $this->user_avatar,
        ]);
    }
}
