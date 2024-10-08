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

    public function __construct($album, $user)
    {
        $this->album = $album;
        $this->user = $user;
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
        ];
    }

    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => 'Album tag ' . $this->album->name . ' was used by ' . $this->user->name . '.',
            'album_id' => $this->album->id,
        ]);
    }
}
