<?php

namespace App\Http\Controllers;

use App\Jobs\UpdateSearchIndex;
use Cache;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\Communities\Models\Community;
use Modules\Posts\Models\Post;
use Modules\User\Models\User;
use Symfony\Component\Console\Output\ConsoleOutput;

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
                'users' => [],
                'communities' => [],
            ]);
        }

        $users = Cache::remember('users_search_' . $query, 300, function () use ($query) {
            $users = User::search($query)->query(function (Builder $query) {
                $query->with(['profile', 'employmentPosts.businessPost']);
            })
                ->paginate(100);

            return $users;
        });

        $communities = Cache::remember('communities_search_' . $query, 300, function () use ($query) {
            $communities = Community::search($query)
                ->paginate(100);

            // attach count of members
            $communities->loadCount('members');

            return $communities;
        });

        return response()->json([
            'data' => [
                'users' => $users,
                'communities' => $communities,
            ]
        ]);
    }

    public function searchPosts(Request $request)
    {
        $query = $request->input('q');

        if (empty($query)) {
            return response()->json([
                'posts' => [],
            ]);
        }

        $page = $request->input('page', 1);


        $posts = Cache::remember('posts_search_' . $query . '_' . $page, 300, function () use ($query, $page) {
            $posts = Post::search($query)->query(function (Builder $query) use ($page) {
                $query->with(relations: [
                    'albums',
                    'comments',
                    'user.profile',
                    'community',
                    'department',
                    'attachments',
                    'poll',
                    'poll.question',
                    'poll.question.options'
                ]);
            })->paginate(20, $page);

            return $posts;
        });

        return response()->json([
            'data' => $posts
        ]);
    }

    public function updateSearchIndex()
    {
        $output = new ConsoleOutput();
        $output->writeln('Updating search index');
        dispatch(new UpdateSearchIndex);
        $output->writeln('Job dispatched');

        return response()->json(['message' => 'Search index updated']);
    }
}

