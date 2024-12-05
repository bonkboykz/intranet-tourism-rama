<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeleteCommunityRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $community;
    public $user;
    public $request;
    public $user_avatar;

    /**
     * Constructor.
     */
    public function __construct($user, $community, $request)
    {
        $this->user = $user;
        $this->community = $community;
        $this->request = $request;

        // Avatar generation logic
        $this->user_avatar = $this->generateAvatar();
    }

    /**
     * Generate avatar URL.
     */
    protected function generateAvatar()
    {
        return $this->user->profile->image
            ?? $this->user->profile->staff_image
            ?? 'https://ui-avatars.com/api/?name=' . urlencode($this->user->name) . '&color=7F9CF5&background=EBF4FF';
    }

    /**
     * Notification channels.
     */
    public function via($notifiable)
    {
        \Log::info("Sending notification to user: {$notifiable->id} via " . implode(', ', ['database', 'broadcast']));
        return ['database', 'broadcast'];
    }


    /**
     * Notification data for the database.
     */
    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->buildMessage(),
            'request_id' => $this->request->id,
            'details' => $this->request->details,
        ];
    }

  


    /**
     * Notification data for broadcast.
     */
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->buildMessage(),
            'request_id' => $this->request->id,
            'details' => $this->request->details,
        ]);
    }

    /**
     * Build notification message.
     */
    protected function buildMessage()
    {
        if ($this->request->status !== 'pending') {
            return 'Your request to delete the community ' . $this->community->name . ' has been ' . $this->request->status . '.';
        }

        return 'New request to delete the community "' . $this->community->name . '".';
    }

    /**
     * Notification data for mail.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->line($this->user->name . ' has requested to delete the community ' . $this->community->name . '.')
            ->action('Review Request', url('/communities/' . $this->community->id . '/requests'))
            ->line('Please review the request and take appropriate action.');
    }
}
