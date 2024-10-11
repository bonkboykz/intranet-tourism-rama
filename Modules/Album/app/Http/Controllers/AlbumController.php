<?php

namespace Modules\Album\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;
use Modules\Album\Models\Album;
use Modules\Post\Models\Post;

class AlbumController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $query = Album::query();
        // if search is provided, filter the results
        if (request()->has('search')) {
            $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower(request('search')) . '%']);
        }
        $albums = $query->get();

        return response()->json([
            'data' => $albums,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'posts' => 'nullable|array',
            'posts.*' => 'exists:posts,id',
        ]);

        $album = new Album();
        $album->name = $validated['name'];
        $album->description = $validated['description'] ?? null;
        $album->save();

        if (isset($validated['posts'])) {
            $album->posts()->attach($validated['posts']);
        }

        return response()->json([
            'data' => $album->load('posts'),
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param Album $album
     * @return JsonResponse
     */
    public function show(Album $album): JsonResponse
    {
        return response()->json([
            'data' => $album->load('posts'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Album $album
     * @return JsonResponse
     */
    public function update(Request $request, Album $album): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'posts' => 'nullable|array',
            'posts.*' => 'exists:posts,id',
        ]);

        if (isset($validated['name'])) {
            $album->name = $validated['name'];
        }

        if (isset($validated['description'])) {
            $album->description = $validated['description'];
        }

        $album->save();

        if (isset($validated['posts'])) {
            $album->posts()->sync($validated['posts']);
        }

        return response()->json(
            [
                'data' => $album->load('posts'),
            ]
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Album $album
     * @return JsonResponse
     */
    public function destroy(Album $album): JsonResponse
    {
        $album->posts()->detach();
        $album->delete();

        return response()->json(null, 204);
    }
}
