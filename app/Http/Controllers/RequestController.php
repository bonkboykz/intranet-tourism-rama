<?php

namespace App\Http\Controllers;

use App\Models\Request;
use App\Notifications\CreateCommunityRequestNotification;
use App\Notifications\CreateRequestForUpdateProfileDepartmentNotification;
use App\Notifications\DeletingCommunityNotification;
use App\Notifications\GroupJoinRequestNotification;
use App\Notifications\PhotoChangeRequestNotification;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Auth;
use Modules\Communities\Helpers\CommunityPermissionsHelper;
use Modules\Communities\Models\Community;
use Modules\Communities\Models\CommunityMember;
use Modules\Crud\Models\BusinessUnit;
use Modules\Department\Models\EmploymentPost;
use Modules\Profile\Models\Profile;
use Modules\User\Models\User;
use Symfony\Component\Console\Output\ConsoleOutput;
use App\Notifications\DeleteCommunityRequestNotification;
use Illuminate\Support\Facades\Log;



class RequestController extends Controller
{

    // Group join requests

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

            if ($request->group) {
                $request->groupFollowersCount = $request->group->members()->count();
            } else {
                $request->groupFollowersCount = 0;
            }
            return $request;
        });

        // filter out join requests where group is null
        $groupJoinRequests->filter(function ($request) {
            return $request->group !== null;
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

        try {
            // Notify all superusers with a reference to the request
            $superusers->get()->each(function ($superuser) use ($newRequest) {
                $superuser->notify(new GroupJoinRequestNotification($newRequest));
            });
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

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

        // if already approved or rejected, return
        if ($requestToUpdate->status === 'approved' || $requestToUpdate->status === 'rejected') {
            return response()->json(['status' => $requestToUpdate->status]);
        }

        $requestToUpdate->status = 'approved';
        $requestToUpdate->action_at = now();
        $requestToUpdate->save();

        // Add the user to the group
        $details = $requestToUpdate->details;
        $groupId = $details['group_id'];
        $group = Community::find($groupId);
        $group->members()->attach($requestToUpdate->user_id, ['role' => 'member']);

        try {
            $user = User::find($requestToUpdate->user_id);
            $user->notify(new GroupJoinRequestNotification($requestToUpdate));
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }


        return response()->json(['status' => $requestToUpdate->status]);
    }

    public function rejectGroupJoinRequest(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
        ]);

        $requestId = $request->request_id;

        $requestToUpdate = Request::findOrFail($requestId);

        // if already approved or rejected, return
        if ($requestToUpdate->status === 'approved' || $requestToUpdate->status === 'rejected') {
            return response()->json(['status' => $requestToUpdate->status]);
        }

        $requestToUpdate->status = 'rejected';
        $requestToUpdate->action_at = now();
        $requestToUpdate->save();


        try {
            $user = User::find($requestToUpdate->user_id);
            $user->notify(new GroupJoinRequestNotification($requestToUpdate));
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->json(['status' => $requestToUpdate->status]);
    }


    // Change staff image request
    public function getChangeStaffImageRequests()
    {
        $changeStaffImageRequests = Request::queryable()
            ->where('request_type', 'change_staff_image')
            ->paginate();

        // attach community details to each request
        $changeStaffImageRequests->getCollection()->transform(function ($request) {
            $details = $request->details;
            $request->new_photo = $details['new_photo'];
            $request->user = User::find($request->user_id);
            $request->userProfile = $request->user->profile;
            if ($request->user->employmentPost) {
                $request->userDepartment = $request->user->employmentPost->department->name;
            }
            return $request;
        });

        // paginate requests
        return response()->json([
            'data' => $changeStaffImageRequests,
        ]);
    }

    public function createChangeStaffImageRequest(HttpRequest $request)
    {
        // $request->validate([
        //     'group_id' => 'required|exists:communities,id',
        // ]);
        $staffImagePath = uploadFile(request()->file('staff_image'), null, 'staff_image')['path'];

        $newPhoto = $staffImagePath;

        // find all superadmins
        $superusers = User::whereHas('roles', function ($query) {
            $query->where('name', 'superadmin');
        });

        // Create the request
        $newRequest = Request::create([
            'user_id' => auth()->id(),
            'request_type' => 'change_staff_image',
            'details' => ['new_photo' => $newPhoto],
            'status' => 'pending',
        ]);

        // Notify all superusers with a reference to the request
        $superusers->get()->each(function ($superuser) use ($newRequest) {
            $superuser->notify(new PhotoChangeRequestNotification($newRequest));
        });

        return response()->json(['status' => 'request_sent']);
    }


    public function approveChangeStaffImageRequest(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
        ]);

        $requestId = $request->request_id;

        $requestToUpdate = Request::findOrFail($requestId);
        // if already approved or rejected, return
        if ($requestToUpdate->status === 'approved' || $requestToUpdate->status === 'rejected') {
            return response()->json(['status' => $requestToUpdate->status]);
        }
        $requestToUpdate->status = 'approved';
        $requestToUpdate->action_at = now();
        $requestToUpdate->save();

        // Add the user to the group
        $details = $requestToUpdate->details;
        $newPhoto = $details['new_photo'];
        $user = User::find($requestToUpdate->user_id);
        $profile = Profile::where('user_id', $user->id)->first();
        $profile->update(['staff_image' => $newPhoto]);

        try {
            $user->notify(new PhotoChangeRequestNotification($requestToUpdate));
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->json(['status' => $requestToUpdate->status]);
    }

    public function rejectChangeStaffImageRequest(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
        ]);

        $requestId = $request->request_id;

        $requestToUpdate = Request::findOrFail($requestId);
        // if already approved or rejected, return
        if ($requestToUpdate->status === 'approved' || $requestToUpdate->status === 'rejected') {
            return response()->json(['status' => $requestToUpdate->status]);
        }
        $requestToUpdate->status = 'rejected';
        $requestToUpdate->action_at = now();
        $requestToUpdate->save();

        try {
            $user = User::find($requestToUpdate->user_id);
            $user->notify(new PhotoChangeRequestNotification($requestToUpdate));
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->json(['status' => $requestToUpdate->status]);
    }

    // Community create request
    public function getCommunityCreateRequests()
    {
        $communityCreateRequests = Request::queryable()
            ->where('request_type', 'create_community')
            ->paginate();

        // attach community details to each request
        $communityCreateRequests->getCollection()->transform(function ($request) {
            $details = $request->details;
            $request->group = [
                'name' => $details['name'],
                'description' => $details['description'],
                'banner' => $details['banner'],
                'banner_original' => $details['banner_original'],
            ];
            $request->user = User::find($request->user_id);
            $request->userProfile = $request->user->profile;
            if ($request->user->employmentPost) {
                $request->userDepartment = $request->user->employmentPost->department->name;
            }
            return $request;
        });

        // paginate requests
        return response()->json([
            'data' => $communityCreateRequests,
        ]);
    }

    // Create a new request and notify the superuser
    public function createCommunityCreateRequest(HttpRequest $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'string',
            'banner' => 'string',
            'banner_original' => 'string',
            'type' => 'required|string',
        ]);

        $name = $request->name;
        $description = $request->description;
        $banner = $request->banner;
        $banner_original = $request->banner_original;
        $type = $request->type;

        // Create the request
        $newRequest = Request::create([
            'user_id' => auth()->id(),
            'request_type' => 'create_community',
            'details' => [
                'name' => $name,
                'description' => $description,
                'banner' => $banner,
                'banner_original' => $banner_original,
                'type' => $type,
            ],
            'status' => 'pending',
        ]);

        try {
            // find all superadmins
            $superusers = User::whereHas('roles', function ($query) {
                $query->where('name', 'superadmin');
            });

            // Notify all superusers with a reference to the request
            $superusers->get()->each(callback: function ($superuser) use ($newRequest) {
                $superuser->notify(new CreateCommunityRequestNotification($newRequest));
            });
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->json(['status' => 'request_sent']);
    }

    public function approveCommunityCreateRequest(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
        ]);

        $requestId = $request->request_id;

        $requestToUpdate = Request::findOrFail($requestId);
        // if already approved or rejected, return
        if ($requestToUpdate->status === 'approved' || $requestToUpdate->status === 'rejected') {
            return response()->json(['status' => $requestToUpdate->status]);
        }
        $requestToUpdate->status = 'approved';
        $requestToUpdate->action_at = now();
        $requestToUpdate->save();

        // Create the community
        $details = $requestToUpdate->details;
        $new_community = Community::create([
            'name' => $details['name'],
            'description' => $details['description'],
            'banner' => $details['banner'],
            'banner_original' => $details['banner_original'],
            'type' => $details['type'],
            'created_by' => $requestToUpdate->user_id,
        ]);

        CommunityMember::create([
            'user_id' => $requestToUpdate->user_id,
            'community_id' => $new_community->id,
            'role' => 'admin',
        ]);

        $user = User::findOrFail($requestToUpdate->user_id);

        CommunityPermissionsHelper::assignCommunityAdminPermissions($user, $new_community);

        try {
            $user = User::find($requestToUpdate->user_id);
            $user->notify(new CreateCommunityRequestNotification($requestToUpdate));
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->json(['status' => $requestToUpdate->status, 'community' => $new_community]);
    }

    public function rejectCommunityCreateRequest(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
        ]);

        $requestId = $request->request_id;

        $requestToUpdate = Request::findOrFail($requestId);
        // if already approved or rejected, return
        if ($requestToUpdate->status === 'approved' || $requestToUpdate->status === 'rejected') {
            return response()->json(['status' => $requestToUpdate->status]);
        }
        $requestToUpdate->status = 'rejected';
        $requestToUpdate->action_at = now();
        $requestToUpdate->save();

        try {
            $user = User::find($requestToUpdate->user_id);
            $user->notify(new CreateCommunityRequestNotification($requestToUpdate));
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->json(['status' => $requestToUpdate->status]);
    }

    public function getCommunityDeleteRequests()
    {
        $communityDeleteRequests = Request::queryable()
            ->where('request_type', 'delete_community')
            ->paginate();

        $communityDeleteRequests->getCollection()->transform(function ($request) {
            $details = $request->details;
            $request->group = [
                'name' => $details['name'],
                'description' => $details['description'],
                'banner' => $details['banner'],
                'banner_original' => $details['banner_original'],
            ];
            $request->user = User::find($request->user_id);
            $request->userProfile = $request->user->profile;
            if ($request->user->employmentPost) {
                $request->userDepartment = $request->user->employmentPost->department->name;
            }
            return $request;
        });

        return response()->json([
            'data' => $communityDeleteRequests,
        ]);
    }

    public function deleteCommunityDeleteRequest(HttpRequest $request)
    {
        $request->validate([
            'community_id' => 'required|exists:communities,id',
        ]);

        $community = Community::findOrFail($request->community_id);

        $newRequest = Request::create([
            'user_id' => auth()->id(),
            'request_type' => 'delete_community',
            'details' => [
                'community_id' => $community->id,
                'name' => $community->name,
                'description' => $community->description,
                'banner' => $community->banner,
                'banner_original' => $community->banner_original,
            ],
            'status' => 'pending',
        ]);

        try {
            $superusers = User::whereHas('roles', function ($query) {
                $query->where('name', 'superadmin');
            });

            $superusers->get()->each(function ($superuser) use ($newRequest) {
                $superuser->notify(new DeleteCommunityRequestNotification($newRequest));
            });
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->json(['status' => 'delete_request_sent']);
    }

    public function approveCommunityDeleteRequest(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
            'community_id' => 'required|exists:communities,id',
        ]);

        $requestId = $request->input('request_id');
        $communityId = $request->input('community_id');

        try {
            $requestToUpdate = Request::findOrFail($requestId);

            if ($requestToUpdate->status === 'approved' || $requestToUpdate->status === 'rejected') {
                return response()->json(['status' => $requestToUpdate->status]);
            }

            $requestToUpdate->status = 'approved';
            $requestToUpdate->action_at = now();
            $requestToUpdate->save();

            $community = Community::findOrFail($communityId);
            $communityMember = $community->members();

            // delete all community members
            CommunityMember::where('community_id', $communityId)->delete();

            $community->delete();

            try {
                $user_id = Auth::id();
                $currentUser = User::where('id', $user_id)->firstOrFail();
                $superusers = User::whereHas('roles', function ($query) {
                    $query->where('name', 'superadmin');
                });

                $superusers->get()->each(function ($superuser) use ($requestToUpdate) {
                    $superuser->notify(new DeleteCommunityRequestNotification($requestToUpdate));
                });

                $communityMember->each(function ($member) use ($currentUser, $communityId) {
                    $member->notify(new DeletingCommunityNotification($communityId, $currentUser));
                });
            } catch (\Throwable $th) {
                $output = new ConsoleOutput();
                $output->writeln($th->getMessage());
            }

            return response()->json(['status' => 'approved', 'request_id' => $requestId, 'community_id' => $communityId]);
        } catch (\Exception $e) {
            Log::error("Error approving community deletion request: " . $e->getMessage());
            return response()->json(['error' => 'Failed to approve community deletion'], 500);
        }
    }



    public function rejectCommunityDeleteRequest(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
        ]);

        $requestId = $request->request_id;
        $requestToUpdate = Request::findOrFail($requestId);

        if ($requestToUpdate->status === 'approved' || $requestToUpdate->status === 'rejected') {
            return response()->json(['status' => $requestToUpdate->status]);
        }

        $requestToUpdate->status = 'rejected';
        $requestToUpdate->action_at = now();
        $requestToUpdate->save();


        try {
            $user = User::find($requestToUpdate->user_id);
            $user->notify(new DeleteCommunityRequestNotification($requestToUpdate));
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->json(['status' => $requestToUpdate->status]);
    }


    public function createRequestForUpdateProfileDepartment(HttpRequest $request)
    {
        $request->validate([
            'department_id' => 'required|exists:departments,id',
            'business_unit_id' => 'required|exists:business_units,id',
            'location' => 'required|string',
            'work_phone' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $department_id = $request->department_id;
        $business_unit_id = $request->business_unit_id;
        $location = $request->location;
        $work_phone = $request->work_phone;
        $user_id = $request->user_id;

        $business_unit_name = BusinessUnit::find($business_unit_id)->name;

        $newRequest = Request::create([
            'user_id' => auth()->id(),
            'request_type' => 'update_profile_department',
            'details' => [
                'department_id' => $department_id,
                'business_unit_id' => $business_unit_id,
                'business_unit_name' => $business_unit_name,
                'location' => $location,
                'work_phone' => $work_phone,
                'user_id' => $user_id,
            ]
        ]);

        try {
            $superusers = User::whereHas('roles', function ($query) {
                $query->where('name', 'superadmin');
            })->get();
            $superusers->each(function ($superuser) use ($newRequest) {
                $superuser->notify(new CreateRequestForUpdateProfileDepartmentNotification($newRequest));
            });
        } catch (\Throwable $th) {

        }

        return response()->json(['status' => 'request_sent']);
    }

    public function approveRequestForUpdateProfileDepartment(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
        ]);

        $requestId = $request->request_id;

        $requestToUpdate = Request::findOrFail($requestId);
        $requestToUpdate->status = 'approved';
        $requestToUpdate->action_at = now();
        $requestToUpdate->save();


        // update the status and change the data
        $details = $requestToUpdate->details;
        //        $user = User::findOrFail($details['user_id']);


        $employmentPost = EmploymentPost::where('user_id', $details['user_id'])->first();
        $employmentPost->update([
            'department_id' => $details['department_id'],
            'business_unit_id' => $details['business_unit_id'],
            'business_unit_name' => $details['business_unit_name'],
            'work_phone' => $details['work_phone'],
            'location' => $details['location'],
        ]);

        try {
            $user = User::find($requestToUpdate->user_id);
            $user->notify(new CreateRequestForUpdateProfileDepartmentNotification($requestToUpdate));
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->json(['status' => $requestToUpdate->status]);
    }

    public function rejectRequestForUpdateProfileDepartment(HttpRequest $request)
    {
        $request->validate([
            'request_id' => 'required|exists:requests,id',
        ]);

        $requestId = $request->request_id;

        $requestToUpdate = Request::findOrFail($requestId);
        $requestToUpdate->status = 'rejected';
        $requestToUpdate->action_at = now();
        $requestToUpdate->save();

        try {
            $user = User::find($requestToUpdate->user_id);
            $user->notify(new CreateRequestForUpdateProfileDepartmentNotification($requestToUpdate));
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->json(['status' => $requestToUpdate->status]);
    }


    public function getRequestForUpdateProfileDepartment()
    {
        $updateProfileDepartmentRequests = Request::queryable()
            ->where('request_type', 'update_profile_department')
            ->paginate();

        $updateProfileDepartmentRequests->getCollection()->transform(function ($request) {
            $details = $request->details;
            $request->department = BusinessUnit::find($details['department_id']);
            $request->business_unit = $details['business_unit_id'];
            $request->business_unit_name = $details['business_unit_name'];
            $request->location = $details['location'];
            $request->work_phone = $details['work_phone'];
            if ($request->user->employmentPost) {
                $request->userDepartment = $request->user->employmentPost->department->name;
                $request->business_unit = BusinessUnit::find($request->user->employmentPost->business_unit_id);
            }
            return $request;
        });

        return response()->json([
            'data' => $updateProfileDepartmentRequests,
        ]);
    }


}
