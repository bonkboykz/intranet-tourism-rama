<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Modules\User\Models\User;

class DeletingFromDepartmentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $department_id;
    public $user;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, $department_id)
    {
        $this->department_id = $department_id;
        $this->user = $user;
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

    // function to send notification to the database
    public function toDatabase(object $notifiable): array
    {
        return [
            'message' => $this->user->name . ' deleted you from department ',
            'department_id' => $this->department_id,
        ];
    }


    public function toBroadcast(object $notifiable): BroadcastMessage {
        return new BroadcastMessage([
            'message' => $this->user->name . ' deleted you from department ',
            'department_id' => $this->department_id,
        ]);
    }

}
