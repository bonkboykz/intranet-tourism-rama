<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;

// This notification informs an admin when a user requests to edit a post.
class PostEditRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $post;
    public $user;
    public $user_avatar;

    public function __construct($post, $user)
    {
        $this->post = $post;
        $this->user = $user;

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

    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->user->name . ' has requested to edit the post: ' . $this->post->title,
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' has requested to edit the post: ' . $this->post->title,
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'user_avatar' => $this->user_avatar,
        ]);
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line($this->user->name . ' has requested to edit the post: ' . $this->post->title)
            ->action('Review Request', url('/posts/' . $this->post->id . '/edit-requests'))
            ->line('Please review the request and take appropriate action.');
    }
}
