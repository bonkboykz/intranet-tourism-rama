<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;

// This notification informs an admin or superuser when a user requests to create a new community.
class ProfileChangeRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $changeDetails;

    public function __construct($user, $changeDetails)
    {
        $this->user = $user;
        $this->changeDetails = $changeDetails;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->user->name . ' has requested to change their profile information.',
            'user_id' => $this->user->id,
            'changes' => $this->changeDetails,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' has requested to change their profile information.',
            'user_id' => $this->user->id,
            'changes' => $this->changeDetails,
        ]);
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line($this->user->name . ' has requested to change their profile information.')
            ->line('Requested changes: ' . json_encode($this->changeDetails))
            ->action('Review Request', url('/users/' . $this->user->id . '/profile-requests'))
            ->line('Please review the request and take appropriate action.');
    }
}
