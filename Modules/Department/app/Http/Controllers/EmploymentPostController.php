<?php

namespace Modules\Department\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Notifications\AddingToDepartmentNotification;
use App\Notifications\DeletingFromDepartmentNotification;
use App\Notifications\LeavingDepartmentNotification;
use App\Notifications\RemovingFromDepartmentNotification;
use Illuminate\Support\Facades\Auth;
use Modules\Department\Helpers\DepartmentPermissionsHelper;
use Modules\Department\Models\Department;
use Modules\Department\Models\EmploymentPost;
use Illuminate\Http\Request;
use Symfony\Component\Console\Output\ConsoleOutput;
use Modules\User\Models\User;

class EmploymentPostController extends Controller
{
    public function index(Request $request)
    {

        if ($request->has('department_id')) {
            $departmentId = $request->get('department_id');

            $members = EmploymentPost::where('department_id', $departmentId)
                ->with(['user.profile', 'businessPost', 'businessGrade', 'businessUnit', 'department', 'supervisor'])
                ->get()
                ->map(function ($employmentPost) {
                    $profile = $employmentPost->user->profile; // Get the profile if it exists
                    return [
                        'user_id' => $employmentPost->user->id,
                        'employment_post_id' => $employmentPost->id,
                        'order' => $employmentPost->order,
                        'business_post_title' => $employmentPost->businessPost->title,
                        'business_grade' => $employmentPost->businessGrade->code,
                        'is_active' => $employmentPost->user->is_active,
                        'name' => $profile ? $profile->bio : 'N/A', // Check if profile exists
                        'staff_image' => $profile && $profile->staff_image ? $profile->staff_image : '/assets/dummyStaffPlaceHolder.jpg',
                        'work_phone' => $employmentPost->work_phone,
                        'phone_no' => $profile ? $profile->phone_no : 'N/A', // Check if profile exists
                        'profile' => $profile,
                        'email' => $employmentPost->user->email,
                        'is_hod' => $employmentPost->is_hod,
                        'is_assistance' => $employmentPost->is_assistance,
                        'department_id' => $employmentPost->department_id,
                        'department_name' => $employmentPost->department->name,
                        'unit_id' => $employmentPost->businessUnit ? $employmentPost->businessUnit->id : null,
                        'parent_id' => $employmentPost->supervisor ? $employmentPost->supervisor->parent_id : null,
                    ];
                });


            return response()->json([
                'data' => $members,
            ]);
        }

        return response()->json([
            'data' => EmploymentPost::queryable()->paginate(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => EmploymentPost::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...EmploymentPost::rules());

        // Check if the user already has an employment post in the same department
        $employmentPost = EmploymentPost::where('user_id', $validated['user_id'])
            ->where('department_id', $validated['department_id'])
            ->first();

        if ($employmentPost) {
            return response()->json([
                'message' => 'User already has an employment post in this department',
            ], 400);
        }

        EmploymentPost::create($validated);



        try {
            $user_id = Auth::id();
            $currentUser = User::where('id', $user_id)->firstOrFail();
            $user = User::find($validated['user_id']); // Retrieve the user being added

            $department = Department::where('id', $validated['department_id'])->first();

            // Send notification to the user who has been added
            $user->notify(new AddingToDepartmentNotification($department->id, $department->name, $currentUser));

        } catch (\Throwable $tr) {
            $output = new ConsoleOutput();
            $output->writeln($tr->getMessage());
        }
        return response()->noContent();
    }


    public function update(EmploymentPost $employment_post)
    {
        $validated = request()->validate(...EmploymentPost::rules('update'));
        $employment_post->update($validated);
        try {
            if (request()->has('report_to')) {
                $user = User::whereKey(request('report_to'))
                    ->has('employmentPost')
                    ->firstOrFail();
                if (!$employment_post->supervisor()->exists()) {
                    $employment_post->supervisor()->create([
                        'parent_id' => $user->employmentPost->id,
                    ]);
                } else {
                    $employment_post->supervisor->update([
                        'parent_id' => $user->employmentPost->id,
                    ]);
                }
            }
        } catch (\Throwable $tr) {
            $output = new ConsoleOutput();
            $output->writeln($tr->getMessage());

            return response()->json([
                'message' => 'An error occurred',
            ], 400);
        }

        return response()->noContent();
    }


    public function destroy(EmploymentPost $employment_post)
    {
        $employment_post->delete();

        // if user is admin revoke
        $user = User::where('id', $employment_post->user_id)->first();
        $department = Department::where('id', $employment_post->department_id)->first();

        if ($user) {
            DepartmentPermissionsHelper::revokeDepartmentAdminPermissions($user, $department);
        }

        try {
            $user_id = Auth::id();
            $currentUser = User::where('id', $user_id)->firstOrFail();

            $user->notify(new RemovingFromDepartmentNotification($department, $currentUser));

            $superusers = User::whereHas('roles', function ($query) {
                $query->where('name', 'superadmin');
            });

            $superusers->get()->each(function ($superuser) use ($user, $department) {
                // notify all superadmins
                $superuser->notify(new LeavingDepartmentNotification($department->id, $user));
            });

            $admins = $department->admins;

            $admins->each(function ($admin) use ($user, $department) {
                // notify all admins
                $admin->notify(new LeavingDepartmentNotification($department->id, $user));
            });
        } catch (\Throwable $tr) {
            $output = new ConsoleOutput();
            $output->writeln($tr->getMessage());
        }


        return response()->noContent();
    }
}
