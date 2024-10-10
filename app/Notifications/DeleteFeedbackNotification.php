<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\User;
use Modules\Polls\Models\Feedback;

class DeleteFeedbackNotification extends Notification implements ShouldQueue
{
    use Queueable;


    public $user;
    public $feedback;
    public $user_avatar;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, Feedback $feedback)
    {
        $this->user = $user;
        $this->feedback = $feedback;

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


    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => 'Feedback was deleted by ' . $this->user->name . '.',
            'feedback_id' => $this->feedback->id,
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => 'Feedback was deleted by ' . $this->user->name . '.',
            'feedback_id' => $this->feedback->id,
            'user_avatar' => $this->user_avatar,
        ]);
    }

}
