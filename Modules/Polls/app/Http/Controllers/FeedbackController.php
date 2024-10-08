<?php

namespace Modules\Polls\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Polls\Models\Feedback;

class FeedbackController extends Controller
{

    public function index()
    {
        return response()->json([
            'data' => Feedback::queryable()->paginate(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => Feedback::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...Feedback::rules());
        Feedback::create($validated);

        return response()->noContent();
    }

    public function update(Feedback $feedback)
    {
        $validated = request()->validate(...Feedback::rules('update'));
        $feedback->update($validated);

        return response()->noContent();
    }

    public function destroy(Feedback $feedback)
    {
        $feedback->delete();

        return response()->noContent();
    }
}
