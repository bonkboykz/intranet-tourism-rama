<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class LikeCommentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $comment_id;
    public $user;


    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, $comment_id)
    {
        $this->user = $user;
        $this->comment_id = $comment_id;
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

    public function toDatabase(object $notifiable): array {
        return [
            'message' => $this->user->name . ' liked a comment.',
            'comment_id' => $this->comment_id,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage {
        return new BroadcastMessage([
            'message' => $this->user->name . ' liked a comment.',
            'comment_id' => $this->comment_id,
        ]);
    }
}
