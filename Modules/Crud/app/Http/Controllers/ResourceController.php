<?php

namespace Modules\Crud\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Crud\Models\Resource;
use Modules\Posts\Models\Post;

class ResourceController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Resource::queryable()->paginate(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => Resource::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...Resource::rules());
        Resource::create($validated);

        return response()->noContent();
    }

    public function update(Resource $resource)
    {
        $validated = request()->validate(...Resource::rules('update'));
        $resource->update($validated);

        return response()->noContent();
    }

    public function destroy(Resource $resource)
    {
        try {
            $post = null;

            if ($resource->attachable_type === 'posts') {
                $post = Post::find($resource->attachable_id);

            }

            $resource->delete();

            if ($post !== null) {
                // if post does not have any more resources or content, delete it
                if ($post->resources()->count() === 0 && ($post->content === null || $post->content === '')) {
                    $post->delete();
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }


        return response()->noContent();
    }
}
