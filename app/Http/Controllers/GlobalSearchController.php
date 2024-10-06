<?php

namespace App\Http\Controllers;

use Cache;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Communities\Models\Community;
use Modules\Posts\Models\Post;
use Modules\User\Models\User;

class GlobalSearchController extends Controller
{
    public function index()
    {
        return Inertia::render('GlobalSearchPage', ['id' => auth()->id()]);
    }

    public function search(Request $request)
    {
        // Get the search query from the request
        $query = $request->input('q');

        if (empty($query)) {
            return response()->json([
                'posts' => [],
                'users' => [],
                'communities' => [],
            ]);
        }


        $posts = Cache::remember('posts_search_' . $query, 300, function () use ($query) {
            $posts = Post::search($query)->query(function (Builder $query) {
                $query->with(['albums', 'comments', 'user.profile', 'community', 'department', 'attachments']);
            })->paginate(20);

            return $posts;
        });


        $users = Cache::remember('users_search_' . $query, 300, function () use ($query) {
            $users = User::search($query)->query(function (Builder $query) {
                $query->with(['profile', 'employmentPosts.businessPost']);
            })
                ->paginate(20);

            return $users;
        });

        $communities = Cache::remember('communities_search_' . $query, 300, function () use ($query) {
            $communities = Community::search($query)
                ->paginate(20);

            // attach count of members
            $communities->loadCount('members');

            return $communities;
        });

        return response()->json([
            'data' => [
                'posts' => $posts,
                'users' => $users,
                'communities' => $communities,
            ]
        ]);
    }
}

