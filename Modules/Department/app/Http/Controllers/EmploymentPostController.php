<?php

namespace Modules\Department\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Department\Models\Department;
use Modules\Department\Models\EmploymentPost;
use Illuminate\Http\Request;
use Symfony\Component\Console\Output\ConsoleOutput;

class EmploymentPostController extends Controller
{
    public function index(Request $request)
    {

        if ($request->has('department_id')) {
            $departmentId = $request->get('department_id');

            $members = EmploymentPost::where('department_id', $departmentId)
                ->with(['user.profile', 'businessPost', 'businessGrade']) // Use relationships
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
                        'employment_post' => $employmentPost,
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

        // check if user already has an employment post, even with different position, in the same department
        $employmentPost = EmploymentPost::where('user_id', $validated['user_id'])
            ->where('department_id', $validated['department_id'])
            ->first();

        if ($employmentPost) {
            return response()->json([
                'message' => 'User already has an employment post in this department',
            ], 400);
        }

        EmploymentPost::create($validated);

        return response()->noContent();
    }

    public function update(EmploymentPost $employment_post)
    {
        $validated = request()->validate(...EmploymentPost::rules('update'));
        $employment_post->update($validated);

        return response()->noContent();
    }


    public function destroy(EmploymentPost $employment_post)
    {
        $employment_post->delete();

        return response()->noContent();
    }
}
