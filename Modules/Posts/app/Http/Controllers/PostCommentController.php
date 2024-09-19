<?php

namespace Modules\Posts\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Posts\Models\Post;
use Modules\Posts\Models\PostComment;

class PostCommentController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => PostComment::queryable()->paginate(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => PostComment::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        request()->merge(['user_id', auth()->id()]);
        request()->merge(['type', 'comment']);

        $validated = request()->validate(...Post::rules());
        $post = Post::create($validated);

        request()->merge(['comment_id' => $post->id]);

        $validated = request()->validate(...PostComment::rules());

        PostComment::create($validated);

        return response()->noContent();
    }

    public function update(PostComment $postComment)
    {
        $user_id = auth()->id();


        $post = $postComment->comment;
        $post->update([
            'content' => request()->content,
            'user_id' => $user_id,
        ]);


        request()->merge(['comment_id' => $post->id]);

        $validated = request()->validate(...PostComment::rules('update'));

        $postComment->update($validated);

        return response()->noContent();
    }


    public function destroy(PostComment $postComment)
    {
        $postComment->delete();

        return response()->noContent();
    }

    public function likes(PostComment $postComment)
    {

    }
}
