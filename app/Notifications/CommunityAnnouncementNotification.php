<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\Communities\Models\Community;
use Modules\User\Models\User;

class CommunityAnnouncementNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $community;
    public $user_avatar;


    public function __construct(User $user, Community $community)
    {
        $this->user = $user;
        $this->community = $community;

        if ($this->user->profile->image) {
            $this->user_avatar = $this->user->profile->image;
        } elseif ($this->user->profile->staff_image) {
            $this->user_avatar = $this->user->profile->staff_image;
        } else {
            $this->user_avatar = 'https://ui-avatars.com/api/?name=' . $this->user->name . '&color=7F9CF5&background=EBF4FF';
        }
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }


    public function toDatabase($notifiable)
    {
        return [
            'message' => $this->user->name . ' made an announcement in ' . $this->community->name,
            'community_id' => $this->community->id,
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => $this->user->name . ' made an announcement in ' . $this->community->name,
            'community_d' => $this->community->id,
            'user_avatar' => $this->user_avatar,
        ]);
    }
}
