<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use App\Models\Request;
use Symfony\Component\Console\Output\ConsoleOutput;

class RequestNotification extends Notification
{
    use Queueable;

    public $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    // Define which channels the notification will be sent on
    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    // Database notification format
    public function toDatabase($notifiable)
    {
        if ($this->request->status !== 'pending') {
            return [
                'message' => 'Your request to join a group has been ' . $this->request->status . '.',
                'request_id' => $this->request->id, // Store the request ID in the notification
                'details' => $this->request->details,
            ];
        }

        return [
            'message' => 'New request to join a group.',
            'request_id' => $this->request->id, // Store the request ID in the notification
            'details' => $this->request->details,
        ];
    }

    // Broadcast notification format (for Laravel Echo + Reverb)
    public function toBroadcast($notifiable)
    {
        // if request was updated (accepted, reject) send a notification to the user
        if ($this->request->status !== 'pending') {
            return new BroadcastMessage([
                'message' => 'Your request to join a group has been ' . $this->request->status . '.',
                'request_id' => $this->request->id,
                'details' => $this->request->details,
            ]);
        }

        return new BroadcastMessage([
            'message' => 'New request to join a group.',
            'request_id' => $this->request->id,
            'details' => $this->request->details,
        ]);
    }

    // Optional: Email notification (if you want to notify via email as well)
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line('New request to join a group.')
            ->action('View Request', url('/requests/' . $this->request->id))
            ->line('Please approve or reject the request.');
    }
}
