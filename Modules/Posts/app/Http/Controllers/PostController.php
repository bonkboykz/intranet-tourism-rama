<?php

namespace Modules\Posts\Http\Controllers;

use App\Http\Controllers\Controller;
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
    // public function index(Request $request)
    // {
    //     // Start with a query builder instance
    //     $query = Post::query();

    //     // Check if the 'filter' parameter is present
    //     if ($request->has('filter')) {
    //         // Apply the necessary filters to the query
    //         if (in_array('birthday', $request->input('filter'))) {
    //             $query->where('type', 'birthday');
    //         }

    //         // If filters are present, paginate the filtered query
    //         $data = $this->shouldPaginate($query);
    //     } else {
    //         // If no filters are present, paginate using the predefined queryable method
    //         $data = $this->shouldPaginate(Post::queryable());
    //     }

    //     return response()->json([
    //         'data' => $data,
    //     ]);
    // }


    public function index(Request $request)
    {
        // Start with a query builder instance
        $query = Post::query();



        // Check if the 'filter' parameter is present
        if ($request->has('filter')) {
            // Apply the necessary filters to the query
            if (in_array('birthday', $request->input('filter'))) {
                $query->where('type', 'birthday');
            }

            // If filters are present, paginate the filtered query
            $data = $this->shouldPaginate($query);
        } else if ($request->has('user_id')) {
            $query->when(request()->has('with'), function ($query) {
                $query->with(request('with'));
            });

            $query->when(request()->has('sort'), function ($query) {
                foreach (request('sort') as $sort) {
                    $query->orderBy(key($sort), current($sort) ?? 'asc');
                }
            });

            // if trying to access another user posts, include mentions
            $query->where(function ($query) use ($request) {
                $userId = $request->input('user_id');

                $query->where('user_id', $userId)
                    ->orWhere(function ($query) use ($userId) {
                        $query->where('mentions', '!=', null)
                            ->whereJsonContains('mentions', [['id' => $userId]]);
                    });
            });

            // combine Post::queryable() with the query
            $data = $this->shouldPaginate($query);
        } else {
            // If no filters are present, paginate using the predefined queryable method
            $data = $this->shouldPaginate(Post::queryable());
        }

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

        // attach department names
        $data->map(function ($post) {
            // if post has accessibilities
            if ($post->accessibilities->isEmpty()) {
                return $post;
            }

            $post->departments = $post->accessibilities->map(function ($accessibility) {
                $department = Department::find($accessibility->accessable_id);
                return $department->name;
            });

            // join with ,
            $post->departmentNames = implode(', ', $post->departments->toArray());
            return $post;
        });

        // TODO: review filtering out posts on backend
        // $user = User::find(Auth::id());
        // $communities = $user->communities;

        // // filter out all posts that current user has no access to
        // $data = $data->filter(function ($post) use ($communities) {
        //     // if user's the author
        //     if ($post->user_id == Auth::id()) {
        //         return true;
        //     }


        //     // if post has accessibilities and user is not the author or user is not beloning to the comminity the post was made
        //     if ($post->accessibilities->isNotEmpty()) {
        //         // check if current user has access through accessibilities
        //         // get list of all user's communities
        //         // filterType = "Department"


        //         return $post->accessibilities->filter(function ($accessibility) use ($communities) {
        //             return $communities->contains('id', $accessibility->accessable_id);
        //         })->isNotEmpty();
        //     }

        //     // if post is public
        //     if ($post->visibility == 'public') {
        //         return true;
        //     }


        //     return false;

        // });

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
}
