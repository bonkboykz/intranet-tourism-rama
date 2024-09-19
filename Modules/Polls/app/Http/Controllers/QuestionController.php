<?php

namespace Modules\Polls\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Polls\Models\Question;


class QuestionController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Question::queryable()->paginate(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => Question::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...Question::rules());
        Question::create($validated);

        return response()->noContent();
    }

    public function update(Question $question)
    {
        $validated = request()->validate(...Question::rules('update'));
        $question->update($validated);

        return response()->noContent();
    }

    public function destroy(Question $question)
    {
        $question->delete();

        return response()->noContent();
    }
}
