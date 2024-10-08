<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\User;
use Modules\Polls\Models\Feedback;

class DeleteFeedbackNotification extends Notification implements ShouldQueue
{
    use Queueable;


    public $user;
    public $feedback;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, Feedback $feedback)
    {
        $this->user = $user;
        $this->feedback = $feedback;
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


    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => 'Feedback was deleted by ' . $this->user->name . '.',
            'feedback_id' => $this->feedback->id,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => 'Feedback was deleted by ' . $this->user->name . '.',
            'feedback_id' => $this->feedback->id,
        ]);
    }

}
