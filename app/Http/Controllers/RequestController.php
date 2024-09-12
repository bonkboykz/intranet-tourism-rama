<?php

namespace App\Http\Controllers;

use App\Events\NewMessageEvent;
use App\Models\Request;
use App\Notifications\GroupJoinRequestNotification;
use Illuminate\Http\Request as HttpRequest;
use Modules\Communities\Models\Community;
use Modules\Communities\Models\CommunityMember;
use Modules\User\Models\User;
use Symfony\Component\Console\Output\ConsoleOutput;

class RequestController extends Controller
{

    public function getGroupJoinRequests()
    {
        $groupJoinRequests = Request::queryable()
            ->where('request_type', 'join_group')
            ->paginate();

        // attach community details to each request
        $groupJoinRequests->getCollection()->transform(function ($request) {
            $details = $request->details;
            $request->group = Community::find($details['group_id']);
            $request->user = User::find($request->user_id);
            $request->userProfile = $request->user->profile;
            if ($request->user->employmentPost) {
                $request->userDepartment = $request->user->employmentPost->department->name;
            }
            $request->groupFollowersCount = $request->group->members()->count();
            return $request;
        });

        // paginate requests
        return response()->json([
            'data' => $groupJoinRequests,
        ]);
    }

    // Create a new request and notify the superuser
    public function createJoinGroupRequest(HttpRequest $request)
    {
        $request->validate([
            'group_id' => 'required|exists:communities,id',
        ]);
        $groupId = $request->group_id;

        // find all superadmins
        $superusers = User::whereHas('roles', function ($query) {
            $query->where('name', 'superadmin');
        });

        // Create the request
        $newRequest = Request::create([
            'user_id' => auth()->id(),
            'request_type' => 'join_group',
            'details' => ['group_id' => $groupId],
            'status' => 'pending',
        ]);

        // Notify all superusers with a reference to the request
        $superusers->get()->each(function ($superuser) use ($newRequest) {
            $superuser->notify(new GroupJoinRequestNotification($newRequest));
        });

        // $event = new NewMessageEvent($superuser, 'New request to join a group.');
        // broadcast($event)->via('reverb');

        return response()->json(['status' => 'request_sent']);
    }

    public function approveGroupJoinRequest(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
        ]);

        $requestId = $request->request_id;

        $requestToUpdate = Request::findOrFail($requestId);
        $requestToUpdate->status = 'approved';
        $requestToUpdate->action_at = now();
        $requestToUpdate->save();

        // Add the user to the group
        $details = $requestToUpdate->details;
        $groupId = $details['group_id'];
        $group = Community::find($groupId);
        $group->members()->attach($requestToUpdate->user_id, ['role' => 'member']);

        $user = User::find($requestToUpdate->user_id);
        $user->notify(new GroupJoinRequestNotification($requestToUpdate));


        return response()->json(['status' => $requestToUpdate->status]);
    }

    public function rejectGroupJoinRequest(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
        ]);

        $requestId = $request->request_id;

        $requestToUpdate = Request::findOrFail($requestId);
        $requestToUpdate->status = 'rejected';
        $requestToUpdate->action_at = now();
        $requestToUpdate->save();


        $user = User::find($requestToUpdate->user_id);
        $user->notify(new GroupJoinRequestNotification($requestToUpdate));

        $event = new NewMessageEvent($user, 'Your request to join a group has been rejected.');
        broadcast($event)->via('reverb');


        return response()->json(['status' => $requestToUpdate->status]);
    }

    // Approve or reject a request
    public function handleRequest(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
            'action' => 'required|in:approve,reject',
        ]);

        $requestId = $request->request_id;
        $action = $request->action;

        $requestToUpdate = Request::findOrFail($requestId);

        if ($action === 'approve') {
            $requestToUpdate->status = 'approved';
        } elseif ($action === 'reject') {
            $requestToUpdate->status = 'rejected';
        }

        $requestToUpdate->action_at = now();
        $requestToUpdate->save();

        return response()->json(['status' => $requestToUpdate->status]);
    }
}
