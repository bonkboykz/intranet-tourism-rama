<?php

namespace Modules\Communities\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Request as AppRequest;
use App\Notifications\CommunityNotification;
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

        $data = request()->has('all') ? $query->get() : $this->shouldPaginate($query);

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

        return response()->json($new_community);
    }

    public function update(Community $community)
    {
        $validated = request()->validate(...Community::rules('update'));
        $community->update($validated);

        return response()->noContent();
    }

    public function destroy(Community $community)
    {
        // revoke permission from all admins
        $admins = $community->admins;

        foreach ($admins as $admin) {
            CommunityPermissionsHelper::revokeCommunityAdminPermissions($admin, $community);
        }

        // remove all members and admins
        $community->admins()->detach();
        $community->members()->detach();

        $community->delete();

        return response()->noContent();
    }

    public function addMember(Community $community)
    {
        request()->validate(Community::rules('addMember'));
        $user = User::findOrFail(request()->user_id);

        // Attach the user to the community
        if (request()->has('role')) {
            $role = request('role');
            $community->members()->attach($user, ['role' => $role]);
        } else {
            $community->members()->attach($user);
        }

        try {
            if (Auth::id() !== $user->id) {
                $current_user = User::where('id', Auth::id())->firstOrFail();

                $user->notify(new CommunityNotification($current_user, $community, 'added'));
            }
        } catch (\Throwable $e) {
        }



        return response()->noContent();
    }



    public function deleteMember(Community $community)
    {
        request()->validate(Community::rules('addMember'));

        $user = User::findOrFail(request()->user_id);

        $community->members()->detach($user->id);

        $user->notify(new CommunityNotification(Auth::user(), $community, 'removed'));

        return response()->noContent();
    }


    public function getAdmins(Community $community)
    {
        // get admins with profile
        $data = $community->admins;

        $data->load('profile');

        return response()->json([
            'data' => $data
        ]);
    }

    public function getMembers(Community $community)
    {
        // get members with profile
        $data = $community->members;

        $data->load('profile');

        return response()->json([
            'data' => $data
        ]);
    }


    // invite community admin
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
  public function revoke(Community $community)
  {
      try {
          $community->admins()->detach();
          $community->members()->detach();

          $community->delete();

          $superAdmins = User::whereHas('roles', function ($query) {
              $query->where('name', 'superadmin');
          })->get();

          foreach ($superAdmins as $superAdmin) {
              $superAdmin->notify(new CommunityNotification(Auth::user(), $community, 'revoke'));
          }

          return response()->json(['message' => 'Community has been deleted successfully.']);
      } catch (\Exception $e) {
          \Log::error('Failed to delete community: ' . $e->getMessage());
          return response()->json(['message' => 'Failed to delete the community.'], 500);
      }
  }



 public function archive(Community $community)
 {
     try {
         $community->is_archived = true;
         $community->save();


         $superAdmins = User::whereHas('roles', function ($query) {
             $query->where('name', 'superadmin');
         })->get();

         foreach ($superAdmins as $superAdmin) {
             $superAdmin->notify(new CommunityNotification(Auth::user(), $community, 'archived'));
         }

         return response()->json(['message' => 'Community has been archived successfully.']);
     } catch (\Exception $e) {
         Log::error('Failed to archive community: ' . $e->getMessage());
         return response()->json(['message' => 'Failed to archive the community.'], 500);
     }
 }


public function unarchive(Community $community)
{
    try {
        $community->is_archived = false;
        $community->save();


        $superAdmins = User::whereHas('roles', function ($query) {
            $query->where('name', 'superadmin');
        })->get();

        foreach ($superAdmins as $superAdmin) {
            $superAdmin->notify(new CommunityNotification(Auth::user(), $community, 'unarchived'));
        }

        return response()->json(['message' => 'Community has been unarchived successfully.']);
    } catch (\Exception $e) {
        Log::error('Failed to unarchive community: ' . $e->getMessage());
        return response()->json(['message' => 'Failed to unarchive the community.'], 500);
    }
}




    public function getLatestCommunities()
    {
        $communities = Community::query()->where('is_archived', false)->orderBy('created_at', 'desc')->limit(5)->get();

        return response()->json([
            'data' => $communities
        ]);
    }
}
