<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class AlbumTagNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $album;
    public $user;
    public $user_avatar;

    public function __construct($album, $user)
    {
        $this->album = $album;
        $this->user = $user;
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
            'message' => 'Album tag ' . $this->album->name . ' was used by ' . $this->user->name . '.',
            'album_id' => $this->album->id,
            'user_avatar' => $this->user_avatar,
        ];
    }

    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => 'Album tag ' . $this->album->name . ' was used by ' . $this->user->name . '.',
            'album_id' => $this->album->id,
            'user_avatar' => $this->user_avatar,
        ]);
    }
}
