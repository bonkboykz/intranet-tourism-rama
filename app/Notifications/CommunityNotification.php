<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class CommunityNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;
    protected $community;
    protected $action;
    public $user_avatar;

    public function __construct($user, $community, $action)
    {
        $this->user = $user;
        $this->community = $community;
        $this->action = $action;

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
        \Log::info("Sending notification to user: {$notifiable->id}");
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        $actionMessage = match($this->action) {
            'added' => 'added you to the community',
            'removed' => 'removed you from the community',
            'archived' => 'archived the community',
            'unarchived' => 'unarchived the community',
            'revoke' => 'deleted the community',
            default => 'performed an action on the community'
        };

        return [
            'user' => $this->user->name,
            'community' => $this->community->name,
            'message' => $this->user->name . ' has ' . $actionMessage . ' ' . $this->community->name,
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast($notifiable)
    {
        $actionMessage = match($this->action) {
            'added' => 'added you to the community',
            'removed' => 'removed you from the community',
            'archived' => 'archived the community',
            'unarchived' => 'unarchived the community',
            'revoke' => 'deleted the community',
            default => 'performed an action on the community'
        };

        return new BroadcastMessage([
            'user' => $this->user->name,
            'community' => $this->community->name,
            'message' => $this->user->name . ' has ' . $actionMessage . ' ' . $this->community->name,
            'user_avatar' => $this->user_avatar,
        ]);
    }
}
