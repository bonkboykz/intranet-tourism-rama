<?php

namespace Modules\Posts\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Notifications\NewPollCreatedNotification;
use Modules\Polls\Models\Feedback;
use Modules\Communities\Models\Community;
use Modules\Polls\Models\Option;
use Modules\Polls\Models\Poll;
use Modules\Polls\Models\Question;
use Modules\Polls\Models\Response as PollResponse;
use Modules\Posts\Models\PostViewHistory;
use Illuminate\Support\Facades\DB;
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
        $query = Post::queryable()->with(['albums', 'comments', 'user.profile', 'community', 'department', 'attachments']);

        // Get the authenticated user
        $user = Auth::user();

        // Apply filter if user is not superadmin
        if (!$user->hasRole('superadmin')) {
            $query->where(function ($query) use ($user) {
                $query->where(function ($query) use ($user) {
                    $query->whereNull('community_id')
                        ->orWhereHas('community', function ($query) use ($user) {
                            $query->where('type', 'public')
                                ->orWhereHas('members', function ($query) use ($user) {
                                    $query->where('user_id', $user->id);
                                });
                        });
                })
                    ->where(function ($query) use ($user) {
                        $query->whereNull('department_id')
                            ->orWhereHas('department', function ($query) use ($user) {
                                $query->whereHas('employmentPosts', function ($query) use ($user) {
                                    $query->where('user_id', $user->id);
                                });
                            });
                    });
            });
        }

        // Sort posts by announcement status and updated_at
        $query->orderByRaw("CASE WHEN announced = true THEN 0 ELSE 1 END")
            ->orderBy('updated_at', 'desc');

        // Paginate the results
        $data = $this->shouldPaginate($query);

        // Load additional relationships
        $data->load([
            'comments' => function ($query) {
                $query->withPivot('id', 'comment_id');
            }
        ]);

        // Map additional data to the posts
        $data->map(function ($post) {
            // Attach likes
            $post->likes = collect($post->likes);

            // Attach tags
            $post->tags = collect($post->tags);

            // Attach accessibilities if available
            if (!$post->accessibilities->isEmpty()) {
                $post->accessibilities = $post->accessibilities;
            }

            return $post;
        });

        // Return the response
        return response()->json([
            'data' => $data,
        ]);
    }



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
        $post->albums = $post->albums()->get();

        $poll = Poll::where('post_id', $post->id)->first();

        if ($poll) {
            $post->poll = $poll;
            $post->poll->question = $poll->question;
            $post->poll->question->options = $poll->question->options;
        }

        return response()->json([
            'data' => $post,
        ]);
    }



    public function store(Post $post)
    {
        request()->merge(['user_id' => Auth::id()]);
        if (request()->has('accessibilities')) {
            $accessibilities = request('accessibilities');
            foreach ($accessibilities as $accessibility) {
                $validatedAccessibilities[] = validator($accessibility, ...PostAccessibility::rules('createFromPost'))->validated();
            }
        } else {
            request()->merge(['visibility' => 'public']);
        }

        // pass albums as an array of ids
        $validated = request()->validate(...Post::rules());

        DB::beginTransaction();
        try {
            $post->fill($validated)->save();
            $post->storeAttachments();
            // add albums
            if (request()->has('albums')) {
                $post->albums()->attach(request('albums'));
            }

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


        // add albums
        if (request()->has('remove_albums')) {
            $post->albums()->sync([]);
        } else if (request()->has('albums')) {
            $post->albums()->sync(request('albums'));
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
            } else if ($post->type === 'poll') {
                Poll::where('post_id', $post->id)->delete();
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

    public function getAlbums()
    {
        // json tag is array of strings which are album names, they could be on any type of post
        // get unique string values from all posts' tag field
        $albums = Post::all()->whereNotNull('tag') // Only consider posts where the 'tag' column is not null
            ->pluck('tag')        // Extract the 'tag' JSON column
            ->flatMap(function ($tags) {
                return json_decode($tags, true); // Decode the JSON to an array
            })
            ->unique()            // Get only unique tags
            ->values()
            ->sort()           // Re-index the collection
            ->toArray();

        return response()->json([
            'data' => $albums,
        ]);
    }

    public function createPoll(Request $request)
    {
        // request body will have
        // 1. question string
        // 2. options array of strings
        // 3. optional end_date
        // 4. boolean multiple (default false)
        // we need to create a post with type poll
        // then create poll, question and options
        // attach questions, options to poll
        // attach poll to post

        $user = Auth::user();
        DB::beginTransaction();
        try {
            $post = Post::create([
                'title' => 'Poll from ' . $user->name,
                'description' => $request->question,
                'type' => 'poll',
                'user_id' => $user->id,
            ]);

            $output = new ConsoleOutput();
            $output->writeln('PostController@createPoll');
            $output->writeln($post->id);

            $poll = Poll::create([
                'title' => 'Poll from ' . $user->name,
                'post_id' => $post->id,
                'user_id' => $user->id,
            ]);

            $question = Question::create([
                'poll_id' => $poll->id,
                'question_text' => $request->question,
                'question_type' => $request->multiple ? 'multiple' : 'single',
            ]);

            // create options from array of strings
            foreach ($request->options as $option) {
                Option::create([
                    'question_id' => $question->id,
                    'option_text' => $option,
                ]);
            }

            DB::commit();

            // find all superadmins
            $superusers = User::whereHas('roles', function ($query) {
                $query->where('name', 'superadmin');
            });

            // Notify all superusers with a reference to the request
            $superusers->get()->each(function ($superuser) use ($post) {
                $output = new ConsoleOutput();
                $output->writeln($superuser->name);

                $superuser->notify(new NewPollCreatedNotification($post));
            });

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }





        return response()->json([
            'data' => $poll,
        ]);
    }

    public function submitPollResponse(Request $request)
    {
        // request has
        // 1. poll_id
        // 2. array of option_ids
        // 3. optional feedbackText string
        // we create a response with user_id, poll_id, answers array of option_ids
        $user = Auth::user();

        DB::beginTransaction();
        try {

            $response = PollResponse::create([
                'user_id' => $user->id,
                'poll_id' => $request->poll_id,
                'answers' => $request->option_ids,
            ]);

            if ($request->has('feedbackText')) {
                $feedback = Feedback::create([
                    'user_id' => $user->id,
                    'poll_id' => $request->poll_id,
                    'feedback_text' => $request->feedbackText,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return response()->json([
            'data' => $response,
        ]);
    }

    public function haveAnsweredPoll(Post $post)
    {
        $poll = $post->poll;

        if (!$poll) {
            return response()->json([
                'data' => null,
            ]);
        }

        $response = PollResponse::where('poll_id', $poll->id)->where('user_id', Auth::id())->first();


        if ($response) {
            return response()->json([
                'data' => $response
            ]);
        }

        return response()->json([
            'data' => null,
        ]);
    }

    public function calculatePollResults(Post $post)
    {
        $poll = $post->poll;

        if (!$poll) {
            return response()->json([
                'data' => null,
            ]);
        }

        // calculate map of presentages per each option_id
        $all_responses = $poll->responses;

        $total_responses = $all_responses->count();

        // get all options
        if (!$poll->question) {
            return response()->json([
                'data' => null,
            ]);
        }

        $options = $poll->question->options;

        // get count of answers from all responses from json
        $count_map = $options->map(function ($option) use ($all_responses) {
            $count = $all_responses->filter(function ($response) use ($option) {
                return in_array($option->id, $response->answers);
            })->count();

            return [
                'option_id' => $option->id,
                'count' => $count,
            ];
        });

        // calculate percentages
        // $percentages_map = $count_map->map(function ($count) use ($total_responses) {
        //     return [
        //         'option_id' => $count['option_id'],
        //         'percentage' => $total_responses > 0 ? ($count['count'] / $total_responses) * 100 : 0,
        //     ];
        // });
        // calculate percentages based on total responses so if user puts 1, 1 on two options it should have 50 50 percents
        $total_count_of_votes = $count_map->sum('count');

        if (!$total_count_of_votes) {
            $percentages_map = $count_map->map(function ($count) {
                return [
                    'option_id' => $count['option_id'],
                    'percentage' => 0,
                ];
            });
        } else {
            $percentages_map = $count_map->map(function ($count) use ($total_count_of_votes) {
                return [
                    'option_id' => $count['option_id'],
                    'percentage' => $total_count_of_votes > 0 ? ($count['count'] / $total_count_of_votes) * 100 : 0,
                ];
            });
        }

        return response()->json([
            'data' => [
                'total_responses' => $total_responses,
                'percentages' => $percentages_map,
                'count_map' => $count_map,
                'total_count_of_votes' => $total_count_of_votes
            ]
        ]);
    }

    public function getUserPolls(Request $request, User $user)
    {
        $posts = Post::where('user_id', '=', $user->id)
            ->where('type', 'poll')
            ->with(['poll', 'poll.question', 'poll.question.options'])
            ->get();

        // attach user profile
        $posts->map(function ($post) {
            $post->user = User::find($post->user_id);
            $post->userProfile = $post->user->profile;
            return $post;
        });


        return response()->json([
            'data' => $posts,
        ]);
    }

    function getPollFeedback(Post $post)
    {
        $feedbacks = Feedback::where('poll_id', $post->poll->id)->get();
        $feedbacks->map(function ($response) {
            $response->user = User::find($response->user_id);
            $response->userProfile = $response->user->profile;

            // attach employmentPost if present
            $response->userEmploymentPost = $response->user->employmentPost;

            // attach department if present
            if ($response->userEmploymentPost) {
                $response->userDepartment = $response->userEmploymentPost->department;
            }

            return $response;
        });

        return response()->json([
            'data' => $feedbacks
        ]);
    }

    public function getPublicMedia()
    {
        $query = Post::query();

        // Apply eager loading for attachments
        $query->with('attachments');


        // Apply filters for image and video MIME types
        $query->whereHas('attachments', function ($query) {
            $query->where(function ($query) {
                $query->where('mime_type', 'like', 'image/%')
                    ->orWhere('mime_type', 'like', 'video/%');
            });
        });

        if (request()->has('album_id')) {
            $query->whereHas('albums', function ($query) {
                $query->where('albums.id', request('album_id'));
            });
        }

        // Filter by either user is superadmin or post has albums
        $query->where(function ($query) {
            $query->whereHas('albums') // Posts with albums
                ->orWhereHas('user.roles', function ($query) {
                    $query->where('name', 'superadmin'); // User is superadmin
                });
        });

        $user = Auth::user();

        if (!$user->hasRole('superadmin')) {
            $query->where(function ($query) use ($user) {
                $query->where(function ($query) use ($user) {
                    $query->whereNull('community_id')
                        ->orWhereHas('community', function ($query) use ($user) {
                            $query->where('type', 'public')
                                ->orWhereHas('members', function ($query) use ($user) {
                                    $query->where('user_id', $user->id);
                                });
                        });
                })
                    ->where(function ($query) use ($user) {
                        $query->whereNull('department_id')
                            ->orWhereHas('department', function ($query) use ($user) {
                                $query->whereHas('employmentPosts', function ($query) use ($user) {
                                    $query->where('user_id', $user->id);
                                });
                            });
                    });
            });
        }

        $posts = $query->get();

        // Return the result as JSON
        return response()->json([
            'data' => $posts
        ]);
    }
}
