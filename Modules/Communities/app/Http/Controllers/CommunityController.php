<?php

namespace Modules\Communities\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Request as AppRequest;
use Illuminate\Http\Request;
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
        $query = Community::queryable();

        $user = User::findOrFail(auth()->id());

        if (!CommunityPermissionsHelper::checkPermission($user, 'view all groups')) {
            $query->where(function ($query) {
                // if community is private then limit to communities user is a member of
                $query->where(function ($query) {
                    $query->where('type', 'public') // Public community
                        ->orWhereHas('members', function ($query) {
                            $query->where('user_id', Auth::id()); // Private community, user is a member
                        })
                        ->orWhereHas('admins', function ($query) {
                            $query->where('user_id', Auth::id()); // Private community, user is an admin
                        });
                });
            });
        }

        // remove soft deleted communities
        $query->whereNull('deleted_at');



        // $output = new ConsoleOutput();

        // $output->writeln(CommunityPermissionsHelper::checkPermission($user, 'view all groups') ? "true" : "false");

        // function replaceBindings($sql, $bindings)
        // {
        //     foreach ($bindings as $binding) {
        //         $value = is_numeric($binding) ? $binding : "'" . addslashes($binding) . "'";
        //         $sql = preg_replace('/\?/', $value, $sql, 1);
        //     }
        //     return $sql;
        // }

        // $sql = $query->toSql(); // Get the raw SQL query
        // $bindings = $query->getBindings(); // Get the query bindings (parameters)
        // // Show the full SQL query with bindings replaced
        // $fullSql = replaceBindings($sql, $bindings);

        // $output->writeln($fullSql);

        $data = $this->shouldPaginate($query);

        $data->map(function ($item) use ($user) {
            $is_member = $item->members()->where('user_id', Auth::id())->exists();
            $is_admin = $item->admins()->where('user_id', Auth::id())->exists();

            $is_superadmin = $user->hasRole('superadmin');

            if ($is_superadmin) {
                $item['is_member'] = true;
                $item['role'] = "superadmin";
            } else if ($is_admin) {
                $item['is_member'] = true;
                $item['role'] = "admin";
            } else if ($is_member) {
                $item["is_member"] = true;
                $item["role"] = "member";
            } else {
                $item['is_member'] = false;
            }

            return $item;
        });

        // attach count of members
        $data->map(function ($item) {
            $item['members_count'] = $item->members()->count();
            return $item;
        });


        return response()->json([
            'data' => $data
        ]);
    }

    public function show($id)
    {
        $data = Community::where('id', $id)->queryable()->firstOrFail();

        $is_member = $data->members()->where('user_id', Auth::id())->exists();
        $is_admin = $data->admins()->where('user_id', Auth::id())->exists();

        $user = User::findOrFail(auth()->id());
        $is_superadmin = $user->hasRole('superadmin');

        if ($is_superadmin) {
            $data['is_member'] = true;
            $data['role'] = "superadmin";
        } else if ($is_admin) {
            $data['is_member'] = true;
            $data['role'] = "admin";
        } else if ($is_member) {
            $data["is_member"] = true;
            $data["role"] = "member";
        } else {
            $data['is_member'] = false;
        }


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

        $user = User::findOrFail(auth()->id());

        CommunityPermissionsHelper::assignCommunityAdminPermissions($user, $new_community);

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
        $user = User::findOrFail(auth()->id());
        CommunityPermissionsHelper::revokeCommunityAdminPermissions($user, $community);

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

    public function getMembers(Community $community)
    {
        return response()->json([
            'data' => $community->members
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

    public function archive(Community $community)
    {
        $community->is_archived = true;
        $community->save();

        return response()->json([
            'message' => 'Community has been archived successfully.'
        ]);
    }

    public function unarchive(Community $community)
    {
        $community->is_archived = false;
        $community->save();

        return response()->json([
            'message' => 'Community has been unarchived successfully.'
        ]);
    }
}
