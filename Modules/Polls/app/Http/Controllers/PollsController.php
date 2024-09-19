<?php

namespace Modules\Polls\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Polls\Models\Poll;


class PollsController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Poll::queryable()->paginate(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => Poll::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...Poll::rules());
        Poll::create($validated);

        return response()->noContent();
    }

    public function update(Poll $poll)
    {
        $validated = request()->validate(...Poll::rules('update'));
        $poll->update($validated);

        return response()->noContent();
    }

    public function destroy(Poll $poll)
    {
        $poll->delete();

        return response()->noContent();
    }
}
