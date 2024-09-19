<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Modules\User\Models\User;
use Pusher\Pusher;
use Symfony\Component\Console\Output\ConsoleOutput;
use Illuminate\Support\Facades\Config;

class PusherController extends Controller
{
    /**
     * Authenticates logged-in user in the Pusher JS app
     * For private channels
     */
    public function pusherAuth(Request $request)
    {

        if (Auth::check()) {
            $user = Auth::user();
            $socket_id = $request->input('socket_id');
            $channel_name = $request->input('channel_name');

            $pusher = new Pusher(
                config('broadcasting.connections.pusher.key'),
                config('broadcasting.connections.pusher.secret'),
                config('broadcasting.connections.pusher.app_id'),
                config('broadcasting.connections.pusher.options')
            );

            $auth = $pusher->socketAuth($channel_name, $socket_id);
            return response($auth, 200);
        } else {
            return response('Forbidden', 403);
        }
    }
}
