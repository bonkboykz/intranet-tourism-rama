<?php

namespace Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\Console\Output\ConsoleOutput;

class UserController extends Controller
{
    // public function index()
    // {
    //     $query = request()->query();
    //     $modelBuilder = User::queryable();
    //     if (array_key_exists('disabledPagination', $query)) {
    //         $data = $modelBuilder->get();
    //     } else {
    //         $data = $modelBuilder->paginate();
    //     }
    //     return response()->json([ 'data' => $data ]);
    // }
    public function index(Request $request)
    {
        $query = $request->query();
        $modelBuilder = User::query();

        // Handle search by name
        if ($request->has('search')) {
            $search = $request->input('search');
            $modelBuilder->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%']);

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
                $data = $modelBuilder->paginate();
            }
        }

        // attach employment_posts if empty
        $data->each(function ($user) {
            if ($user->employment_posts == null) {
                $user->employment_posts = [];
            } else if ($user->employment_posts->isEmpty()) {
                $user->employment_posts = $user->employmentPosts()->with('department', 'businessPost', 'businessUnit')->get() ?? [];
            }
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
        }
        // with relations expanded: department, businessPost, businessUnit
        $user->employment_posts = $user->employmentPosts()->with('department', 'businessPost', 'businessUnit')->get() ?? [];
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
        $validated = request()->validate(...User::rules('update'));
        $user->update($validated);

        return response()->noContent();
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->noContent();
    }
}
