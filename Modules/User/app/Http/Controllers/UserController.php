<?php

namespace Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use Auth;
use Modules\Department\Models\Department;
use Modules\User\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\Console\Output\ConsoleOutput;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->query();
        $modelBuilder = User::query();

        $user = Auth::user();

        // Handle search by name
        if ($request->has('search')) {
            $search = $request->input('search');
            $modelBuilder->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%']);

            $modelBuilder->with(['profile', 'roles', 'employmentPosts.department', 'employmentPosts.businessPost', 'employmentPosts.businessUnit', 'employmentPosts.supervisor']);

            if (!$user->hasRole('superadmin')) {
                // TODO: is_active due to legacy means is_deactivated, should be renamed
                $modelBuilder->where('is_active', false);
            }

            // Skip pagination if search is present and disabledPagination is set
            if (array_key_exists('disabledPagination', $query)) {
                $data = $modelBuilder->get();
            } else {
                $data = $modelBuilder->paginate();
            }
        } else {
            // Handle pagination for general queries without search
            if (array_key_exists('disabledPagination', $query)) {
                $data = $modelBuilder->get();
            } else {
                $data = $modelBuilder->paginate(100);
            }
        }


        // Attach employment_posts if empty
        $data->each(function ($user) {
            $user->employment_posts = $user->employmentPosts()->with(['department', 'businessPost', 'businessUnit', 'supervisor'])->get();
            $user->employment_post = $user->employmentPosts()->with(['department', 'businessPost', 'businessUnit', 'supervisor'])->first();
        });

        return response()->json(['data' => $data]);
    }


    public function show($id)
    {
        $user = User::where('id', $id)->with('profile', 'roles')->firstOrFail();

        $user->isSuperAdmin = $user->hasRole('superadmin');
        $user->employmentPost = $user->employmentPost()->first();
        if ($user->employmentPost) {
            $user->employmentPost->department = $user->employmentPost->department()->first();
            $user->employmentPost->businessPost = $user->employmentPost->businessPost()->first();
            $user->employmentPost->supervisor = $user->employmentPost->supervisor()->first();
        }
        // with relations expanded: department, businessPost, businessUnit
        $user->employment_posts = $user->employmentPosts()->with(['department', 'businessPost', 'businessUnit', 'supervisor.parent.user'])->get() ?? [];
        $user->employmentPosts = $user->employment_posts;

        return response()->json([
            'data' => $user
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...User::rules());
        User::create($validated);

        return response()->noContent();
    }

    public function update(User $user)
    {
        // $validated = request()->validate(...User::rules('update'));
        $user->update(request()->all());

        return response()->noContent();
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->noContent();
    }

    public function byDepartment(Department $department)
    {
        return response()->json([
            'data' => [
                'data' => $department->members()->has('employmentPost')->get(),
            ],
        ]);
    }
}
