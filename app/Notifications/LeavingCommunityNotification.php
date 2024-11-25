<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class LeavingCommunityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $community_id;
    public $community_name;
    public $user;
    public $user_avatar;
    /**
     * Create a new notification instance.
     */
    public function __construct($community_id, $community_name, User $user)
    {
        $this->community_id = $community_id;
        $this->user = $user;
        $this->community_name = $community_name;

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
            'message' => $this->user->name . ' has left the community ' . $this->community_name . '.',
            'community_id' => $this->community_id,
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' has left the community ' . $this->community_name . '.',
            'community_id' => $this->community_id,
            'user_avatar' => $this->user_avatar,
        ]);
    }
}
