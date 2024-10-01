<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Symfony\Component\Console\Output\ConsoleOutput;

// This notification informs an admin when a user requests to change their profile photo.

class PhotoChangeRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

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
        $output = new ConsoleOutput();
        $output->writeln('PhotoChangeRequestNotification: toDatabase()');


        if ($this->request->status !== 'pending') {
            return [
                'message' => 'Your request to change a photo has been ' . $this->request->status . '.',
                'request_id' => $this->request->id, // Store the request ID in the notification
                'details' => $this->request->details,
            ];
        }

        return [
            'message' => 'New request to change photo.',
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
                'message' => 'Your request to change a photo has been ' . $this->request->status . '.',
                'request_id' => $this->request->id,
                'details' => $this->request->details,
            ]);
        }

        return new BroadcastMessage([
            'message' => 'New request to change photo.',
            'request_id' => $this->request->id,
            'details' => $this->request->details,
        ]);
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line($this->user->name . ' has requested to change their profile photo.')
            ->action('Review Request', url('/users/' . $this->user->id . '/photo-requests'))
            ->line('Please review the request and take appropriate action.');
    }
}
