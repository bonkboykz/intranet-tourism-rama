<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class DeletingPostFromDashboardNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $post_id;

    public function __construct(User $user, $post_id)
    {
        $this->user = $user;
        $this->post_id = $post_id;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable) {
        return [
            'message' => "Your post has been deleted by {$this->user->name}.",
            'post_id' => $this->post_id,
        ];
    }

    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => "Your post has been deleted by {$this->user->name}.",
            'post_id' => $this->post_id,
        ]);
    }
}
