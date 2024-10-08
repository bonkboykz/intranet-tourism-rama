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


    public function __construct(User $user, $community_id) {
        $this->user = $user;
        $this->community_id = $community_id;
    }
    public function via($notifiable) {
        return ['database', 'broadcast'];
    }
    public function toDatabase($notifiable) {
        return [
            'message' => 'Your post from community has been deleted by ' . $this->user->name,
            'community_id' => $this->community_id,
        ];
    }

    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => 'Your post from community has been deleted by ' . $this->user->name,
            'community_id' => $this->community_id,
        ]);
    }

}
