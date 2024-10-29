<?php

namespace Modules\Posts\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Notifications\AdminCreatedPostNotification;
use App\Notifications\AlbumTagNotification;
use App\Notifications\CommentNotification;
use App\Notifications\CommunityAnnouncementNotification;
use App\Notifications\DashboardAnnouncementNotification;
use App\Notifications\DeletingPostFromCommunityNotification;
use App\Notifications\DeletingPostFromDashboardNotification;
use App\Notifications\DeletingPostFromDepartmentNotification;
use App\Notifications\LikeCommentNotification;
use App\Notifications\NewPollCreatedInCommunityNotification;
use App\Notifications\NewPollCreatedInDepartmentNotification;
use App\Notifications\DepartmentAnnouncementNotification;
use App\Notifications\NewPollCreatedNotification;
use App\Notifications\PollFeedbackNotification;
use App\Notifications\UserBirthdayWishNotification;
use App\Notifications\UserGotMentioned;
use App\Notifications\UserGotMentionedInCommentNotification;
use App\Notifications\UserGotMentionedInCommunityNotification;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Notifications\LikeNotification;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;
use Modules\Communities\Helpers\CommunityPermissionsHelper;
use Modules\Department\Helpers\DepartmentPermissionsHelper;
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

        // Get the variant input from the request
        $variant = $request->input('variant');

        // $output = new ConsoleOutput();
        // $output->writeln('PostController@index');
        // $output->writeln($variant);

        // Apply different logic based on variant
        if ($variant === 'dashboard') {
            // For 'dashboard' variant: Don't show posts from departments/communities unless they are post_as=admin
            // Private communities should check for membership, public communities should skip membership checks
            if (!$user->hasRole('superadmin')) {
                $query->where(function ($query) use ($user) {
                    // Public communities or posts where post_as is admin
                    $query->where(function ($query) use ($user) {
                        $query->whereNull('community_id')
                            ->orWhereHas('community', function ($query) use ($user) {
                                // For public communities, no membership check is needed
                                $query->where(['type' => 'public', 'post_as' => 'admin'])
                                    // For private communities, check if user is a member
                                    ->orWhere(function ($query) use ($user) {
                                    $query->where('type', 'private')
                                        ->whereHas('members', function ($query) use ($user) {
                                            $query->where('user_id', $user->id);
                                        });
                                });
                            });

                    })
                        // Private departments require membership, post_as admin bypasses checks
                        ->where(function ($query) use ($user) {
                            $query->whereNull('department_id')
                                ->orWhereHas('department', function ($query) use ($user) {
                                    // Check if the post is admin or user is a member of the department
                                    $query->where('post_as', 'admin');
                                });
                        })
                        // Include posts from the user
                        ->orWhere('user_id', $user->id);
                });
            }
        } else {
            // For other variants: Show all posts, but private communities and departments should check for membership
            if (!$user->hasRole('superadmin')) {
                $query->where(function ($query) use ($user) {
                    $query->where(function ($query) use ($user) {
                        // Private communities should check for membership, public communities skip membership checks
                        $query->whereNull('community_id')
                            ->orWhereHas('community', function ($query) use ($user) {
                                // Public communities
                                $query->where('type', 'public')
                                    // For private communities, check if user is a member
                                    ->orWhere(function ($query) use ($user) {
                                    $query->where('type', 'private')
                                        ->whereHas('members', function ($query) use ($user) {
                                            $query->where('user_id', $user->id);
                                        });
                                });
                            });
                    })
                        // Departments should also check membership, post_as admin bypasses checks
                        ->where(function ($query) use ($user) {
                            $query->whereNull('department_id')
                                ->orWhereHas('department', function ($query) use ($user) {
                                    // Check for admin posts or user being part of the department
                                    $query->where('post_as', 'admin')
                                        ->orWhereHas('employmentPosts', function ($query) use ($user) {
                                        $query->where('user_id', $user->id);
                                    });
                                });
                        });
                });
            }
        }

        // Sort posts by announcement status and updated_at
        $query->orderByRaw("CASE WHEN announced = true THEN 0 ELSE 1 END")
            ->orderBy('created_at', 'desc');

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
            'department',
            'community',
            'comments' => function ($query) {
                $query->withPivot('id', 'comment_id');
            }
        ]);

        // attach user by user_id
        $post->user = User::find($post->user_id);
        $post->user->profile = $post->user->profile;
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
            $post->poll->feedbacks = Feedback::where('poll_id', $poll->id)->get();
        }

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

        if (!request()->has('content') || request('content') === null) {
            request()->merge(['content' => '']);
        }

        // Validate and save the post
        $validated = request()->validate(...Post::rules());

        DB::beginTransaction();
        try {
            $post->fill($validated)->save();
            $post->storeAttachments();

            // Attach albums if they exist
            if (request()->has('albums')) {
                $post->albums()->attach(request('albums'));
            }

            // Create accessibilities if they exist
            if (request()->has('accessibilities')) {
                $post->accessibilities()->createMany($validatedAccessibilities);
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollback();
            throw $th;
        }

        try {
            $current_user = User::findOrFail(Auth::id()); // Fetch current user directly

            // Handle birthday mentions
            if (isset($validated['type']) && $validated['type'] === 'birthday') {
                $mentionedUsers = json_decode($post->mentions, true);
                if (!empty($mentionedUsers)) {
                    $firstMentionedUserId = $mentionedUsers[0]['id'];
                    $mentionedUser = User::find($firstMentionedUserId);
                    if ($mentionedUser) {
                        $mentionedUser->notify(new UserBirthdayWishNotification($current_user));
                    }
                }
            }

            // Notify superusers for albums
            if (request()->has('albums')) {
                $albums = $post->albums;
                $superusers = User::whereHas('roles', function ($query) {
                    $query->where('name', 'superadmin');
                })->get();
                foreach ($albums as $album) {
                    foreach ($superusers as $superuser) {
                        $superuser->notify(new AlbumTagNotification($album, $current_user));
                    }
                }
            }

            // Handle department announcements
            if (isset($validated['department_id']) && isset($validated['announced']) && $validated['announced'] == '1') {
                $department = Department::find($validated['department_id']);
                if ($department) {
                    $department->members()->each(function ($member) use ($current_user, $department) {
                        $member->notify(new DepartmentAnnouncementNotification($current_user, $department));
                    });
                }
            }
            // Handle community announcements
            elseif (isset($validated['community_id']) && isset($validated['announced']) && $validated['announced'] == '1') {
                $community = Community::find($validated['community_id']);
                if ($community) {
                    $community->members()->each(function ($member) use ($current_user, $community) {
                        $member->notify(new CommunityAnnouncementNotification($current_user, $community));
                    });
                }
            }
            // Handle dashboard announcements for all other cases
            elseif (isset($validated['announced']) && $validated['announced'] == '1') {
                User::where('id', '!=', $current_user->id)->chunk(10, function ($users) use ($current_user) {
                    foreach ($users as $user) {
                        $user->notify(new DashboardAnnouncementNotification($current_user));
                    }
                });
            }

            // Handle mentions in the post
            if (isset($validated['department_id'])) {
                $department = Department::find($validated['department_id']);
                $mentionedUsers = json_decode($post->mentions, true);
                $mentionedUserIds = array_map(fn($user) => $user['id'], $mentionedUsers);
                $mentionedUsers = User::whereIn('id', $mentionedUserIds)->get();

                // Notify mentioned users
                foreach ($mentionedUsers as $user) {
                    $user->notify(new UserGotMentioned($current_user, $department->name));
                }

                // Notify all department members if the current user is an admin
                if (DepartmentPermissionsHelper::isAdmin($current_user, $department)) {
                    $department->members()->each(function ($member) use ($current_user, $department) {
                        $member->notify(new AdminCreatedPostNotification($current_user, $department->name));
                    });
                }
            }
            // Handle community mentions
            elseif (isset($validated['community_id'])) {
                $community = Community::find($validated['community_id']);
                $mentionedUsers = json_decode($post->mentions, true);
                $mentionedUserIds = array_map(fn($user) => $user['id'], $mentionedUsers);
                $mentionedUsers = User::whereIn('id', $mentionedUserIds)->get();

                // Notify mentioned users
                foreach ($mentionedUsers as $user) {
                    $user->notify(new UserGotMentioned($current_user, $community->name));
                }

                // Notify all community members if the current user is an admin
                if (CommunityPermissionsHelper::isAdmin($current_user, $community)) {
                    $community->members()->each(function ($member) use ($current_user, $community) {
                        $member->notify(new AdminCreatedPostNotification($current_user, $community->name));
                    });
                }
            }
            // Handle default notifications
            else {
                $mentionedUsers = json_decode($post->mentions, true);
                $mentionedUserIds = array_map(fn($user) => $user['id'], $mentionedUsers);
                $mentionedUsers = User::whereIn('id', $mentionedUserIds)->get();

                foreach ($mentionedUsers as $user) {
                    $user->notify(new UserGotMentioned($current_user, 'Dashboard'));
                }

                // Notify other users if the current user is a superadmin
                if ($current_user->hasRole('superadmin')) {
                    User::where('id', '!=', $current_user->id)->chunk(10, function ($users) use ($current_user) {
                        foreach ($users as $user) {
                            $user->notify(new AdminCreatedPostNotification($current_user, 'Dashboard'));
                        }
                    });
                }
            }

        } catch (\Throwable $th) {
            $output->writeln($th->getMessage());
        }

        return response()->noContent();
    }

    public function update(Request $request, Post $post)
    {
        $output = new ConsoleOutput();
        $output->writeln('PostController@update');
        // $validated = request()->validate(...Post::rules('update'));
        // $validated = request()->validate(...Post::rules());
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

        if (request()->has('remove_events')) {
            $post->event = null;
        } else {
            $post->event = request()->event;
        }

        DB::beginTransaction();
        try {

            $post->update(request()->all());


            if (request()->has('attachments')) {
                // Handle JSON objects (if any)
                $jsonAttachments = [];
                $binaryAttachments = [];

                // Check if attachments are binary or JSON objects
                foreach ($request->attachments as $attachment) {
                    // If it's a string (JSON object ID), add it to jsonAttachments
                    if (is_string($attachment)) {
                        $jsonAttachments[] = $attachment;
                    } else {
                        // Otherwise, it's a binary file
                        $binaryAttachments[] = $attachment;
                    }
                }

                // Handle the JSON object attachments (preserve these)
                $existingAttachments = $post->attachments->pluck('id')->toArray();
                $preserveAttachments = array_intersect($existingAttachments, $jsonAttachments);

                // Delete any previous attachments that were not in JSON objects
                $deleteAttachments = array_diff($existingAttachments, $preserveAttachments);
                if (!empty($deleteAttachments)) {
                    $post->attachments()->whereIn('id', $deleteAttachments)->delete();
                }

                // Handle the binary file attachments (upload new files)
                if (!empty($binaryAttachments)) {
                    foreach ($binaryAttachments as $resource) {
                        // Upload the binary file
                        $resourceRef = uploadFile($resource);
                        // Save the new attachment
                        $post->attachments()->create(array_merge($resourceRef, [
                            'user_id' => auth()->id() ?? 1, // default user ID 1 if no auth
                            'for' => $request->input('for'), // assuming 'for' comes from the request
                            'metadata' => $resourceRef,
                        ]));
                    }
                }

            } else {
                $post->attachments()->delete();
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


        try {
            $current_user = User::where('id', Auth::id())->firstOrFail();

            $mentionedUsers = (array) json_decode($post->mentions);
            $mentionedUsers = array_map(function ($user) {
                return $user->id;
            }, $mentionedUsers);


            $mentionedUsers = User::whereIn('id', $mentionedUsers)->get();
            $mentionedUsers->each(function ($mentionedUser) use ($post, $current_user) {
                $department_id = $post->department->id ?? null;
                $community_id = $post->community->id ?? null;
                if (isset($validated['department_id'])) {
                    $mentionedUser->notify(new UserGotMentionedInDepartmentNotification($current_user, $department_id));
                } elseif (isset($validated['community_id'])) {
                    $mentionedUser->notify(new UserGotMentionedInCommunityNotification($current_user, $community_id));
                } else {
                    $mentionedUser->notify(new UserGotMentioned($current_user, 'Dashboard'));
                }
            });
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
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
            $author = $post->user;
            $post_id = $post->id;
            $community_id = $post->community->id ?? null;
            $department_id = $post->department->id ?? null;

            // delete attachments
            $post->attachments()->delete();

            $post->delete();
            DB::commit();

            try {
                $user_id = Auth::id();
                $currentUser = User::where('id', $user_id)->firstOrFail();

                if ($community_id) {
                    $author->notify(new DeletingPostFromCommunityNotification($currentUser, $community_id));
                } elseif ($department_id) {
                    $author->notify(new DeletingPostFromDepartmentNotification($currentUser, $department_id));
                } else {
                    $author->notify(new DeletingPostFromDashboardNotification($currentUser, $post_id));
                }
            } catch (\Throwable $th) {
                $output = new ConsoleOutput();
                $output->writeln($th->getMessage());
            }


            return response()->noContent();
        } catch (\Throwable $th) {
            DB::rollback();
            throw $th;
        }
    }

    public function like(Post $post)
    {
        // Ensure likes is an array
        if ($post->likes === null) {
            $post->likes = [];
        }

        $user_id = Auth::id();
        $user_already_liked = in_array($user_id, $post->likes);

        if ($user_already_liked) {
            // Filter out the user id and ensure it's cast back to an array
            $post->likes = array_values(array_filter($post->likes, fn($id) => $id != $user_id));
            $post->save();

            return response()->noContent();
        }

        // Add the user id and make sure to cast back to an array after pushing
        $post->likes = array_unique(array_merge($post->likes, [$user_id]));
        $post->save();

        try {
            $author = $post->user;
            $user_id = Auth::id();
            $currentUser = User::where('id', $user_id)->firstOrFail();

            if ($author->id !== $user_id) {
                $currentUser = User::findOrFail($user_id); // Получаем текущего пользователя

                if ($post->type === 'comment') {
                    $author->notify(new LikeCommentNotification($currentUser));
                } else {
                    $author->notify(new LikeNotification($currentUser, $post));
                }
            }

        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->noContent();
    }


    public function unlike(Post $post)
    {
        $user_id = Auth::id();
        $post->likes = array_values(array_filter($post->likes, fn($id) => $id != $user_id));
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

        try {
            $user_id = Auth::id();
            $author = $post->user;
            $currentUser = User::where('id', $user_id)->firstOrFail();

            $mentionedUsers = (array) json_decode($comment->mentions);
            $mentionedUsers = array_map(function ($user) {
                return $user->id;
            }, $mentionedUsers);

            $mentionedUsers = User::whereIn('id', $mentionedUsers)->get();
            $mentionedUsers->each(function ($mentionedUser) use ($comment, $currentUser) {
                $mentionedUser->notify(new UserGotMentionedInCommentNotification($comment, $comment->id, $currentUser));
            });

            if($author->id !== $currentUser->id) {
                $author->notify(new CommentNotification($currentUser, $post));
            }
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

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

        // get all stories that were created in the last 24 hours
        $stories = Post::where('type', 'story')
            ->where('created_at', '>', now()->subHours(24))
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
                'community_id' => $request->community_id,
                'department_id' => $request->department_id,
                'post_as' => $request->post_as,
            ]);

            // $output = new ConsoleOutput();
            // $output->writeln('PostController@createPoll');
            // $output->writeln($post->id);

            $poll = Poll::create([
                'title' => 'Poll from ' . $user->name,
                'post_id' => $post->id,
                'user_id' => $user->id,
                'end_date' => $request->end_date,
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

            try {
                // find all superadmins
                $superusers = User::whereHas('roles', function ($query) {
                    $query->where('name', 'superadmin');
                });

                $currentUser = User::where('id', $user->id)->firstOrFail();

                // Notify all superusers with a reference to the request
                $superusers->get()->each(function ($superuser) use ($post) {
                    $department_id = $post->department->id ?? null;
                    $community_id = $post->community->id ?? null;
                    if ($department_id) {
                        $superuser->notify(new NewPollCreatedInDepartmentNotification($department_id));
                    } elseif ($community_id) {
                        $superuser->notify(new NewPollCreatedInCommunityNotification($community_id));
                    } else {
                        $superuser->notify(new NewPollCreatedNotification($post));
                    }
                });
            } catch (\Throwable $th) {
                $output = new ConsoleOutput();
                $output->writeln($th->getMessage());
            }
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

        // if no options_ids, make empty array
        if (!$request->option_ids) {
            $request->option_ids = [];
        }

        DB::beginTransaction();
        try {

            // check if user already answered the poll
            $response = PollResponse::where('poll_id', $request->poll_id)->where('user_id', $user->id)->first();

            if ($response) {
                // if yes, update answers

                $response->answers = $request->option_ids;
                $response->save();

                DB::commit();

                return response()->json([
                    'data' => $response,
                ]);
            }

            $response = PollResponse::create([
                'user_id' => $user->id,
                'poll_id' => $request->poll_id,
                'answers' => $request->option_ids,
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return response()->json([
            'data' => $response,
        ]);
    }

    public function submitPollFeedback(Request $request)
    {
        // request has
        // 1. poll_id
        // 2. feedbackText string
        // we create a feedback with user_id, poll_id, feedbackText
        $user = Auth::user();

        DB::beginTransaction();
        try {
            $feedback = Feedback::create([
                'user_id' => $user->id,
                'poll_id' => $request->poll_id,
                'feedback_text' => $request->feedbackText,
            ]);


            $poll = Poll::where('id', $request->poll_id)->with(['user', 'post'])->firstOrFail();

            $author = $poll->user;
            $post = $poll->post;

            try {
                // get user with profile
                $user = User::query()->where('id', $user->id)->with('profile')->firstOrFail();

                $author->notify(new PollFeedbackNotification($post, $user));
            } catch (\Throwable $th) {
                $output = new ConsoleOutput();
                $output->writeln($th->getMessage());
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }

        return response()->json([
            'data' => $feedback,
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
            ->with(['poll', 'poll.question', 'poll.question.options', 'department', 'community'])
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

        $query->with(relations: 'attachments');

        // Apply filters for image and video MIME types
        if (request()->has('only_video')) {
            $query->whereHas('attachments', function ($query) {
                $query->where('mime_type', 'like', 'video/%');
            });
        } else if (request()->has('only_image')) {
            $query->whereHas('attachments', function ($query) {
                $query->where('mime_type', 'like', 'image/%');
            });
        } else {
            $query->whereHas('attachments', function ($query) {
                $query->where(function ($query) {
                    $query->where('mime_type', 'like', 'image/%')
                        ->orWhere('mime_type', 'like', 'video/%');
                });
            });
        }

        if (request()->has('album_id')) {
            $query->whereHas('albums', function ($query) {
                $query->where('albums.id', request('album_id'));
            });
        }

        // Filter by either user is superadmin or post has albums, or user is author
        $query->where(function ($query) {
            $query->whereHas('albums') // Posts with albums
                ->orWhereHas('user.roles', function ($query) {
                    $query->where('name', 'superadmin'); // User is superadmin
                })
                ->orWhereHas('user', function ($query) {
                    $query->where('id', Auth::id()); // User is author
                });
        });

        $user = Auth::user();

        if (!$user->hasRole('superadmin')) {
            $query->where(function ($query) use ($user) {
                $query->where(function ($query) use ($user) {
                    $query->whereNull('community_id')
                        ->orWhereHas('community', function ($query) use ($user) {
                            $query->whereHas('members', function ($query) use ($user) {
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

        // $output = new ConsoleOutput();

        // $output->writeln(request()->has('only_video') ? 'true' : 'false');
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

        // not birthday, or story
        $query->where('type', '!=', 'birthday')
            ->where('type', '!=', 'story');

        $query->orderBy('created_at', 'desc');

        $posts = $query->paginate(20);

        // Return the result as JSON
        return response()->json([
            'data' => $posts
        ]);
    }


    public function getMedia()
    {
        $query = Post::query();

        // Apply eager loading for attachments
        $query->with(relations: 'attachments');


        // Apply filters for image and video MIME types

        if (request()->has('only_video')) {
            $query->whereHas('attachments', function ($query) {
                $query->where('mime_type', 'like', 'video/%');
            });
        } else if (request()->has('only_image')) {
            $query->whereHas('attachments', function ($query) {
                $query->where('mime_type', 'like', 'image/%');
            });
        } else {
            $query->whereHas('attachments', function ($query) {
                $query->where(function ($query) {
                    $query->where('mime_type', 'like', 'image/%')
                        ->orWhere('mime_type', 'like', 'video/%');
                });
            });
        }

        if (request()->has('community_id')) {
            $query->where('community_id', request('community_id'));
        } else if (request()->has('department_id')) {
            $query->where('department_id', request('department_id'));
        } else if (request()->has('user_id')) {
            $query->where('user_id', request('user_id'));
        }

        $user = Auth::user();

        // if (!$user->hasRole('superadmin')) {
        //     $query->where(function ($query) use ($user) {
        //         $query->where(function ($query) use ($user) {
        //             $query->whereNull('community_id')
        //                 ->orWhereHas('community', function ($query) use ($user) {
        //                     $query->whereHas('members', function ($query) use ($user) {
        //                         $query->where('user_id', $user->id);
        //                     });
        //                 });
        //         })
        //             ->where(function ($query) use ($user) {
        //                 $query->whereNull('department_id')
        //                     ->orWhereHas('department', function ($query) use ($user) {
        //                         $query->whereHas('employmentPosts', function ($query) use ($user) {
        //                             $query->where('user_id', $user->id);
        //                         });
        //                     });
        //             });
        //     });
        // }

        // not birthday, or story
        $query->where('type', '!=', 'birthday')
            ->where('type', '!=', 'story');


        $query->orderBy('created_at', 'desc');

        $posts = $query->paginate(1);

        // Return the result as JSON
        return response()->json([
            'data' => $posts
        ]);
    }

    public function announce(Post $post)
    {
        $post->announced = true;
        $post->save();

        try {
            if ($post->department_id !== null) {
                $department = $post->department()->firstOrFail();
                $current_user = User::where('id', $post->user_id)->firstOrFail();
                $department->members->each(function ($member) use ($department, $current_user) {
                    $member->notify(new DepartmentAnnouncementNotification($current_user, $department));
                });
            } elseif ($post->community_id !== null) {
                $community = $post->community()->firstOrFail();
                $current_user = User::where('id', $post->user_id)->firstOrFail();
                $community->members->each(function ($member) use ($community, $current_user) {
                    $member->notify(new CommunityAnnouncementNotification($current_user, $community));
                });
                $community->admins->each(function ($admin) use ($community, $current_user) {
                    $admin->notify(new CommunityAnnouncementNotification($current_user, $community));
                });
            } else {
                $current_user = User::where('id', $post->user_id)->firstOrFail();

                User::whereNot('id', $current_user->id)->chunk(10, function ($users) use ($current_user) {
                    $users->each(function ($user) use ($current_user) {
                        $user->notify(new DashboardAnnouncementNotification($current_user));
                    });
                });
            }
        } catch (\Throwable $th) {
            $output = new ConsoleOutput();
            $output->writeln($th->getMessage());
        }

        return response()->noContent();
    }

    public function unannounce(Post $post)
    {
        $post->announced = false;
        $post->save();

        return response()->noContent();
    }

    public function closePoll(Post $post)
    {
        $poll = $post->poll;
        $poll->end_date = now();
        $poll->save();

        return response()->noContent();
    }

    public function exportPoll(Post $post)
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

        // options with name, count, percentage
        $options = $options->map(function ($option) use ($count_map, $percentages_map) {
            $count = $count_map->firstWhere('option_id', $option->id)['count'];
            $percentage = $percentages_map->firstWhere('option_id', $option->id)['percentage'];

            return [
                'option_id' => $option->id,
                'option_text' => $option->option_text,
                'count' => $count,
                'percentage' => $percentage,
            ];
        });

        $output = new ConsoleOutput();
        $output->writeln('PostController@exportPoll');
        // stringify options and output
        $output->writeln(json_encode($options));

        $feedbacks = Feedback::where('poll_id', $post->poll->id)->get();
        $responses = $feedbacks->map(function ($response) {
            $user = User::findOrFail($response->user_id);

            $userEmploymentPost = $user->employmentPost;

            $departmentName = "No department";
            $positionName = "No title";

            if ($userEmploymentPost && $userEmploymentPost->businessPost) {
                $positionName = $userEmploymentPost->businessPost->title;
            }

            // attach department if present
            if ($userEmploymentPost->department) {
                $departmentName = $userEmploymentPost->department->name;
            }


            return [
                'created_at' => $response->created_at,
                'name' => $user->name,
                'position' => $positionName,
                'department' => $departmentName,
                'email' => $user->email,
                'text' => $response->feedback_text,
            ];
        });

        // Load the PDF view and pass the events data
        $pdf = Pdf::loadView('polls.pdf', [
            'options' => $options,
            'logoPath' => public_path('assets/logo.png'), // Path to the logo
            'title' => 'Jomla Poll Results', // The title for the PDF
            'feedbacks' => $responses,
        ]);

        return $pdf->download('events.pdf');
    }

    public function updatePoll(Request $request, Post $post)
    {
        // edit question_text and end_date
        $poll = $post->poll;

        if (!$poll) {
            return response()->json([
                'data' => null,
            ]);
        }

        $question = $poll->question;

        $validated = request()->validate([
            'question' => ['required', 'string'],
        ]);

        $question->question_text = $validated['question'];

        if (request()->has('end_date')) {
            $poll->end_date = request('end_date');
        }

        $question->save();

        $poll->save();

        return response()->json([
            'data' => $question,
        ]);
    }

}
