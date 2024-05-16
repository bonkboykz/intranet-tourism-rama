<?php

namespace Modules\Crud\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Crud\Models\EmploymentPost;

class EmploymentPostController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => EmploymentPost::queryable()->paginate(),
        ]);
    }

    public function show()
    {
        return response()->json([
            'data' => EmploymentPost::where('id', request('id'))->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...EmploymentPost::rules());
        EmploymentPost::create($validated);

        return response()->noContent();
    }

    public function update(EmploymentPost $employment_post)
    {
        $validated = request()->validate(...EmploymentPost::rules('update'));
        $employment_post->update($validated);

        return response()->noContent();
    }

    public function delete(EmploymentPost $employment_post)
    {
        $employment_post->delete();

        return response()->noContent();
    }
}
