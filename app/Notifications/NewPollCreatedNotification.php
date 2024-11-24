<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\Posts\Models\Post;

class NewPollCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $post;
    public $user;
    public $user_avatar;

    /**
     * Create a new notification instance.
     */
    public function __construct(Post $post, $user)
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
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
////    public function toMail(object $notifiable): MailMessage
////    {
////        return (new MailMessage)
////            ->line('The introduction to the notification.')
////            ->action('Notification Action', url('/'))
////            ->line('Thank you for using our application!');
////    }

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

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => 'New poll created.',
            'post_id' => $this->post->id,
            'user_avatar' => $this->user_avatar,
            'details' => []
        ]);
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => 'New poll created.',
            'post_id' => $this->post->id,
            'user_avatar' => $this->user_avatar,
            'details' => []
        ];
    }
}
