<?php

namespace App\Notifications;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;
use Illuminate\Notifications\Messages\BroadcastMessage;

class AssigningAdminCommunityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $community_id;
    public $is_admin;
    public $user_avatar;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, $community_id, $is_admin = false)
    {
        $this->user = $user;
        $this->community_id = $community_id;
        $this->is_admin = $is_admin;
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
            'message' => $this->is_admin ? $this->user->name . ' was assigned as an admin in community'
                : 'You were assigned as an admin in community',
            'community_id' => $this->community_id,
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->is_admin ? $this->user->name . ' was assigned as an admin in community'
                : 'You were assigned as an admin in community',
            'community_id' => $this->community_id,
            'user_avatar' => $this->user_avatar,

        ]);
    }

}
