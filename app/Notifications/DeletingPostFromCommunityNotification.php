<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class DeletingPostFromCommunityNotification extends Notification implements ShouldQueue
{

    use Queueable;
    public $user;
    public $community_id;
    public $user_avatar;


    public function __construct(User $user, $community_id) {
        $this->user = $user;
        $this->community_id = $community_id;

        if ($this->user->profile->image) {
            $this->user_avatar = $this->user->profile->image;
        } elseif ($this->user->profile->staff_image) {
            $this->user_avatar = $this->user->profile->staff_image;
        } else {
            $this->user_avatar = 'https://ui-avatars.com/api/?name=' . $this->user->name . '&color=7F9CF5&background=EBF4FF';
        }
    }
    public function via($notifiable) {
        return ['database', 'broadcast'];
    }
    public function toDatabase($notifiable) {
        return [
            'message' => 'Your post from community has been deleted by ' . $this->user->name,
            'community_id' => $this->community_id,
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => 'Your post from community has been deleted by ' . $this->user->name,
            'community_id' => $this->community_id,
            'user_avatar' => $this->user_avatar,
        ]);
    }

}
