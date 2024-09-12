<?php

namespace Modules\Posts\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Communities\Models\Community;
use Modules\Posts\Models\PostViewHistory;
use Illuminate\Support\Facades\DB;
use Log;
use Modules\Department\Models\Department;
use Modules\Posts\Models\Post;
use Modules\Posts\Models\PostAccessibility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Modules\Posts\Models\PostComment;
use Modules\Resources\Models\Resource;
use Symfony\Component\Console\Output\ConsoleOutput;
use Modules\User\Models\User;

class PostController extends Controller
{

    public function index(Request $request)
    {
        // // Check if the 'filter' parameter is present
        // if ($request->has('filter')) {
        //     // Apply the necessary filters to the query
        //     if (in_array('birthday', $request->input('filter'))) {
        //         $query->where('type', 'birthday');
        //     }

        //     // If filters are present, paginate the filtered query
        //     $data = $this->shouldPaginate($query);
        // }
        $query = Post::queryable();
        // If no filters are present, paginate using the predefined queryable method
        // Logic for filtering based on community and department membership
        $user = User::find(Auth::id());
        if (!$user->hasRole('superadmin')) {
            $query->where(function ($query) {
                // Filter by community if it exists
                $query->where(function ($query) {
                    // Either community_id is null, or the community is public, or the user is a member of a private community
                    $query->whereNull('community_id') // No community, pass
                        ->orWhereHas('community', function ($query) {
                            $query->where('type', 'public') // Public community
                                ->orWhereHas('members', function ($query) {
                                    $query->where('user_id', Auth::id()); // Private community, user is a member
                                });
                        });
                });

                // Filter by department if it exists
                $query->where(function ($query) {
                    // Either department_id is null, or the user is employed in the department
                    $query->whereNull('department_id') // No department, pass
                        ->orWhereHas('department', function ($query) {
                            $query->whereHas('employmentPosts', function ($query) {
                                $query->where('user_id', Auth::id()); // User is employed in the department
                            });
                        });
                });
            });
        }

        $query->orderByRaw("CASE WHEN announced = true THEN 0 ELSE 1 END")
            ->orderBy('updated_at', 'desc'); // Sort by created_at for all posts

        $data = $this->shouldPaginate($query);

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

        // Load the comments relationship with pivot data for all posts
        // sorted by updated_at in descending order
        $data->load([
            'comments' => function ($query) {
                $query->withPivot('id', 'comment_id');
            }
        ]);

        // attach likes
        $data->map(function ($post) {
            $post->likes = collect($post->likes);
            return $post;
        });

        // attach user profile
        $data->map(function ($post) {
            $post->user = User::find($post->user_id);
            $post->userProfile = $post->user->profile;
            return $post;
        });

        // attach tags
        $data->map(function ($post) {
            $post->tags = collect($post->tags);
            return $post;
        });

        $data->map(function ($post) {
            // if post has accessibilities
            if ($post->accessibilities->isEmpty()) {
                return $post;
            }

            // TODO: Uncomment if needed
            // // attach department names
            // $post->departmentsWithAccess = $post->accessibilities->map(function ($accessibility) {
            //     $department = Department::find($accessibility->accessable_id);
            //     return $department;
            // });

            // // attach communities
            // $post->communitiesWithAccess = $post->accessibilities->map(function ($accessibility) {
            //     $community = Community::find($accessibility->accessable_id);
            //     return $community;
            // });


            return $post;
        });

        // attach community if present
        $data->map(function ($post) {
            if ($post->community_id) {
                $post->community = Community::find($post->community_id);
            }
            return $post;
        });

        // attach department if present
        $data->map(function ($post) {
            if ($post->department_id) {
                $post->department = Department::find($post->department_id);
            }
            return $post;
        });

        return response()->json([
            'data' => $data,
        ]);
    }



    // public function show($id)
    // {
    //     return response()->json([
    //         'data' => Post::where('id', $id)->queryable()->firstOrFail(),
    //     ]);
    // }

    public function show($id)
    {
        $post = Post::where('id', $id)->firstOrFail();

        $post->load([
            'comments' => function ($query) {
                $query->withPivot('id', 'comment_id');
            }
        ]);

        // attach user by user_id
        $post->user = User::find($post->user_id);
        $post->attachments = Resource::where('attachable_id', $post->id)->get();
        $post->comments = $post->comments->map(function ($comment) {
            $comment->user = User::find($comment->user_id);
            return $comment;
        });
        $post->likes = collect($post->likes);

        return response()->json([
            'data' => $post,
        ]);
    }



    public function store(Post $post)
    {
        $output = new ConsoleOutput();
        $output->writeln('PostController@store');

        request()->merge(['user_id' => Auth::id()]);
        if (request()->has('accessibilities')) {
            $accessibilities = request('accessibilities');
            foreach ($accessibilities as $accessibility) {
                $validatedAccessibilities[] = validator($accessibility, ...PostAccessibility::rules('createFromPost'))->validated();
            }
        } else {
            request()->merge(['visibility' => 'public']);
        }

        $validated = request()->validate(...Post::rules());

        DB::beginTransaction();
        try {
            $post->fill($validated)->save();
            $post->storeAttachments();

            if (request()->has('accessibilities')) {
                $post->accessibilities()->createMany($validatedAccessibilities);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw $th;
        }

        return response()->noContent();
    }

    public function update(Post $post)
    {
        $output = new ConsoleOutput();
        $output->writeln('PostController@update');
        $validated = request()->validate(...Post::rules('update'));
        $validated = request()->validate(...Post::rules());
        $validatedAccessibilities = [];

        if (request()->has('accessibilities')) {
            $accessibilities = request('accessibilities');
            foreach ($accessibilities as $accessibility) {
                $validatedAccessibilities[] = validator($accessibility, ...PostAccessibility::rules('createFromPost'))->validated();
            }
        }

        DB::beginTransaction();
        try {

            $post->update($validated);

            if (request()->has('attachments')) {

                // $resources = Resource::where('attachable_id', $post->id)->first();
                // $resources = Resource::where('attachable_id', $post->id)->first();
                $post->storeAttachments();
                // $resources->delete();

            }
            if (request()->has('accessibilities')) {
                $currentAccessibilities = $post->accessibilities()->get();

                foreach ($validatedAccessibilities as $validatedAccessibility) {
                    $currentAccessibilities->each(function ($accessibility) use ($validatedAccessibility) {
                        $accessibility->update([
                            'accessable_type' => $validatedAccessibility['accessable_type'],
                            'accessable_id' => $validatedAccessibility['accessable_id']
                        ]);
                    });
                }
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw $th;
        }


        return response()->noContent();
    }

    public function destroy(Post $post)
    {
        DB::beginTransaction();
        try {
            if ($post->type == 'comment') {
                PostComment::where('comment_id', $post->id)->delete();
            }
            $post->delete();
            DB::commit();
            return response()->noContent();
        } catch (\Throwable $th) {
            DB::rollback();
            throw $th;
        }
    }

    public function like(Post $post)
    {
        abort_unless(Auth::check(), 403);

        $post->likes = collect($post->likes)->push(Auth::id())->unique()->toArray();
        $post->save();

        return response()->noContent();
    }


    public function unlike(Post $post)
    {
        abort_unless(Auth::check(), 403);

        $post->likes = collect($post->likes)->filter(fn($id) => $id != Auth::id())->unique()->toArray();
        $post->save();

        return response()->noContent();
    }

    public function comment(Post $post)
    {
        request()->merge(['user_id' => Auth::id()]);
        request()->merge(['type' => 'comment']);
        request()->merge(['visibility' => 'public']);
        $validated = request()->validate(...Post::rules());

        $comment = Post::create($validated);
        PostComment::create([
            'post_id' => $post->id,
            'comment_id' => $comment->id,
        ]);

        return response()->noContent();
    }

    public function access(Post $post)
    {
        $validated = request()->validate(...PostAccessibility::rules());
        $post->accesssibilities()->create($validated);

        return response()->noContent();
    }

    public function likes($id)
    {
        $post = Post::where('id', $id)->firstOrFail();
        // get all users who liked the post

        $users = User::whereIn('id', $post->likes)->get();

        // contsuct object with only name and image
        $users = $users->map(function ($user) {
            return [
                'name' => $user->name,
                'image' => $user->profile->image,
            ];
        });


        return response()->json([
            'data' => $users,
        ]);
    }

    public function markAsViewed($id)
    {
        $post = Post::where('id', $id)->firstOrFail();
        $user = Auth::user();

        $viewed = PostViewHistory::where('post_id', $post->id)
            ->where('user_id', $user->id)
            ->first();

        if (!$viewed) {
            PostViewHistory::create([
                'post_id' => $post->id,
                'user_id' => $user->id,
                'viewed_at' => now(),
            ]);
        }

        return response()->noContent();
    }

    public function getRecentStories()
    {
        $output = new ConsoleOutput();
        $output->writeln('PostController@getRecentStories');

        // get all stories that were created in the last 72 hours
        $stories = Post::where('type', 'story')
            ->where('created_at', '>', now()->subHours(72))
            ->get();


        $stories->map(function ($post) {
            $post->attachments = Resource::where('attachable_id', $post->id)->get();
            $post->comments = $post->comments->map(function ($comment) {
                $comment->user = User::find($comment->user_id);
                return $comment;
            });
            $post->likes = collect($post->likes);

            return $post;
        });

        // Attach user viewed
        $user = Auth::user();

        $stories->map(function ($post) use ($user) {
            $viewed = PostViewHistory::where('post_id', $post->id)
                ->where('user_id', $user->id)
                ->first();

            $post->viewed = $viewed ? true : false;
            return $post;
        });

        return response()->json([
            'data' => $stories,
        ]);
    }
}
