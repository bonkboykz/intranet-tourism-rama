<?php

namespace Modules\Communities\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Request as AppRequest;
use Illuminate\Http\Request;
use Modules\Communities\Helpers\CommunityPermissionHelper;
use Modules\Communities\Helpers\CommunityPermissionsHelper;
use Modules\User\Models\User;
use Auth;
use Modules\Communities\Models\Community;
use Modules\Communities\Models\CommunityMember;
use Symfony\Component\Console\Output\ConsoleOutput;

class CommunityController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Community::queryable()->paginate(),
        ]);
    }

    public function show($id)
    {
        $community_member = CommunityMember::where('user_id', Auth::id())->where('community_id', $id);

        $data = Community::where('id', $id)->queryable()->firstOrFail();

        $data['is_member'] = $community_member->exists();
        $data['role'] = $community_member->value('role');

        // check if user have sent a request to join
        $data['is_join_request_pending'] = AppRequest::where('user_id', Auth::id())
            ->where('request_type', 'join_group')
            ->where('status', 'pending')
            ->whereJsonContains('details->group_id', intval($id))
            ->exists();

        return response()->json([
            'data' => $data,
        ]);
    }

    public function store()
    {

        $validated = request()->validate(...Community::rules());
        $new_community = Community::create($validated);

        CommunityMember::create([
            'user_id' => Auth::id(),
            'community_id' => $new_community['id'],
            'role' => 'admin',
        ]);

        return response()->noContent();
    }

    public function update(Community $community)
    {
        $validated = request()->validate(...Community::rules('update'));
        $community->update($validated);

        return response()->noContent();
    }

    public function destroy(Community $community)
    {
        $community->delete();

        return response()->noContent();
    }

    public function addMember(Community $community)
    {

        request()->validate(Community::rules('addMember'));
        $user = User::findOrFail(request()->user_id);

        if (request()->has('role')) {

            $role = request('role');
            $community->members()->attach($user, ['role' => $role]);

        } else {
            $community->members()->attach($user);
        }

        return response()->noContent();
    }

    public function deleteMember(Community $community)
    {

        request()->validate(Community::rules('addMember'));

        $user = User::findOrFail(request()->user_id);

        $community->members()->detach($user->id);

        return response()->noContent();
    }

    public function getAdmins(Community $community)
    {
        return response()->json([
            'data' => $community->admins,
        ]);
    }


    // invie community admin
    public function inviteCommunityAdmin(Request $request)
    {
        $user = User::findOrFail(auth()->id());
        if (!CommunityPermissionsHelper::checkSpecificPermission($user, 'add remove an admin from the same group', $request->community_id)) {
            abort(403, 'Unauthorized action.');
        }

        // Validate the request to ensure user and community are valid
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'community_id' => 'required|exists:communities,id',
        ]);

        // Fetch the user and the community
        $user = User::findOrFail($request->user_id);
        $community = Community::findOrFail($request->community_id);

        // Assign the user the community-specific permissions
        CommunityPermissionsHelper::assignCommunityAdminPermissions($user, $community);


        return response()->json([
            'message' => 'User has been successfully invited as a community admin.',
        ]);
    }

    // revoke community admin
    public function revokeCommunityAdmin(Request $request)
    {
        $user = User::findOrFail(auth()->id());

        if (!CommunityPermissionsHelper::checkSpecificPermission($user, 'add remove an admin from the same group', $request->community_id)) {
            abort(403, 'Unauthorized action.');
        }

        // Validate the request to ensure user and community are valid
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'community_id' => 'required|exists:communities,id',
        ]);

        // Fetch the user and the community
        $user = User::findOrFail($request->user_id);
        $community = Community::findOrFail($request->community_id);

        // Revoke the user's community-specific permissions
        CommunityPermissionsHelper::revokeCommunityAdminPermissions($user, $community);

        return response()->json([
            'message' => 'User has been successfully revoked as a community admin.',
        ]);
    }
}
