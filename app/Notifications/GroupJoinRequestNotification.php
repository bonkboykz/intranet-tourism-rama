<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;

// This notification informs an admin or superuser when a user requests to join a group.
class GroupJoinRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $group;
    public $user;

    public $request;

    // public function __construct($request, $group, $user)
    // {
    //     $this->group = $group;
    //     $this->user = $user;
    // }


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


    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line($this->user->name . ' has requested to join the group ' . $this->group->name)
            ->action('Review Request', url('/groups/' . $this->group->id . '/requests'))
            ->line('Please review the request and take appropriate action.');
    }
}
