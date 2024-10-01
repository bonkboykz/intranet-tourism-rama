<?php

namespace Modules\Department\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Department\Models\BusinessPost;

class BusinessPostController extends Controller
{
    public function index()
    {
        $limit = request()->get('perpage', 15);

        return response()->json([
            'data' => BusinessPost::queryable()->paginate($limit),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => BusinessPost::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    // public function store()
    // {
    //     $validated = request()->validate(...BusinessPost::rules());
    //     BusinessPost::create($validated);

    //     return response()->noContent();
    // }

    public function store()
    {
        $validated = request()->validate(...BusinessPost::rules());
        $businessPost = BusinessPost::create($validated);

        return response()->json([
            'data' => $businessPost,
        ], 201);
    }

    public function update(BusinessPost $business_post)
    {
        $validated = request()->validate(...BusinessPost::rules('update'));
        $business_post->update($validated);

        return response()->noContent();
    }

    public function destroy(BusinessPost $business_post)
    {
        $business_post->delete();

        return response()->noContent();
    }
}
