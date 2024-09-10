<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Modules\User\Models\User;
// use Illuminate\Http\Request;

// use Inertia\Inertia;

class NotificationController extends Controller
{
    // Fetch all notifications for the authenticated user
    public function index()
    {
        $user = User::find(auth()->id());
        $notifications = $user->notifications()->latest()->get();

        return response()->json([
            'data' => $notifications,
        ]);
    }

    public function getRecentNotifications()
    {
        $user = User::find(auth()->id());
        $notifications = $user->notifications()->latest()->take(10)->get();

        return response()->json([
            'data' => $notifications,
        ]);
    }

    // Mark notification as read
    public function markAsRead($notificationId)
    {
        $notification = Notification::find($notificationId);

        if ($notification) {
            $notification->read_at = now();
            $notification->save();
        }

        return response()->json(data: ['status' => 'read']);
    }

    // public function index()
    // {
    //     return Inertia::render('Notification', ['id' => auth()->id()]);
    // }

    // public function index_unread()
    // {
    //     return Inertia::render('Notification_unread', ['id' => auth()->id()]);
    // }

    // public function testing()
    // {
    //     return Inertia::render('Noti-popup-test', ['id' => auth()->id()]);
    // }
}
