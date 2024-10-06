<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\Posts\Models\Post;
use Modules\User\Models\User;
use Symfony\Component\Console\Output\ConsoleOutput;

class PollFeedbackNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $post;
    public $user;

    public $user_avatar;
    /**
     * Create a new notification instance.
     */
    public function __construct(Post $post, User $user)
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

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'New feedback on your poll.',
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return [
            'message' => 'New feedback on your poll.',
            'post_id' => $this->post->id,
            'user_id' => $this->user->id,
            'user_name' => $this->user->name,
            'user_avatar' => $this->user_avatar,
        ];
    }
}
