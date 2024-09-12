<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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

        $user = User::find(auth()->user()->id);
        $socket_id = $request['socket_id'];
        $channel_name = $request['channel_name'];
        $key = Config::get('broadcasting.connections.reverb.key');
        $secret = config('broadcasting.connections.reverb.secret');
        $app_id = config('broadcasting.connections.reverb.app_id');

        if ($user) {

            $pusher = new Pusher($key, $secret, $app_id);
            $auth = $pusher->socketAuth($channel_name, $socket_id);
            return response($auth, 200);

        } else {
            header('', true, 403);
            echo "Forbidden";
            return;
        }
    }
}
