<?php
namespace App\Notifications;


use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use \Illuminate\Bus\Queueable;
use Modules\Posts\Models\Post;
use Modules\User\Models\User;

class LikeNotification extends Notification implements ShouldQueue
{

    use Queueable;

    public $user;
    public $post;

    public function __construct(User $user, Post $post) {
        $this->user = $user;
        $this->post = $post;
    }


    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable) {
        // Send a notification
        return [
            'message' => $this->user->name . " liked your post.",
            'post_id' => $this->post->id,
        ];
    }
    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => $this->user->name . " liked your post.",
            'post_id' => $this->post->id,
        ]);
    }
}
