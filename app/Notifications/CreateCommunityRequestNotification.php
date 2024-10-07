<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CreateCommunityRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $community;
    public $user;

    public $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        if ($this->request->status !== 'pending') {
            return [
                'message' => 'Your request to create a community has been ' . $this->request->status . '.',
                'request_id' => $this->request->id, // Store the request ID in the notification
                'details' => $this->request->details,
            ];
        }

        return [
            'message' => 'New request to create a community.',
            'request_id' => $this->request->id, // Store the request ID in the notification
            'details' => $this->request->details,
        ];
    }

    // Broadcast notification format (for Laravel Echo + Reverb)
    public function toBroadcast($notifiable)
    {
        // if request was updated (accepted, rejected) send a notification to the user
        if ($this->request->status !== 'pending') {
            return new BroadcastMessage([
                'message' => 'Your request to create a community has been ' . $this->request->status . '.',
                'request_id' => $this->request->id,
                'details' => $this->request->details,
            ]);
        }

        return new BroadcastMessage([
            'message' => 'New request to create a community.',
            'request_id' => $this->request->id,
            'details' => $this->request->details,
        ]);
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line($this->user->name . ' has requested to create the community ' . $this->community->name)
            ->action('Review Request', url('/communities/' . $this->community->id . '/requests'))
            ->line('Please review the request and take appropriate action.');
    }
}
