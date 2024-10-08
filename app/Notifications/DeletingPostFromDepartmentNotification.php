<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class DeletingPostFromDepartmentNotification extends Notification implements ShouldQueue
{

    use Queueable;
    public $user;
    public $department_id;


    public function __construct(User $user, $department_id) {
        $this->user = $user;
        $this->department_id = $department_id;
    }

    public function via($notifiable) {
        return ['database', 'broadcast'];
    }


    public function toDatabase($notifiable) {
        return [
            'message' => 'Your post from department has been deleted by' . $this->user->name,
            'department_id' => $this->department_id,
        ];
    }

    public function toBroadcast($notifiable) {
        return new BroadcastMessage([
            'message' => 'Your post from department has been deleted by' . $this->user->name,
            'department_id' => $this->department_id,
        ]);
    }

}
