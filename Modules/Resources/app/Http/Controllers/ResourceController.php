<?php

namespace Modules\Resources\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Resources\Models\Resource;

class ResourceController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => $this->shouldPaginate(Resource::queryable()),
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
        $resource->delete();

        return response()->noContent();
    }
}
