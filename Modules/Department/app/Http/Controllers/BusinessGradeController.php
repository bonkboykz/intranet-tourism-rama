<?php

namespace Modules\Department\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Department\Models\BusinessGrade;

class BusinessGradeController extends Controller
{
    public function index()
    {
        $limit = request()->get('perpage', 15);

        return response()->json([
            'data' => BusinessGrade::queryable()->paginate($limit),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => BusinessGrade::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...BusinessGrade::rules());
        BusinessGrade::create($validated);

        return response()->noContent();
    }

    public function update(BusinessGrade $business_grade)
    {
        $validated = request()->validate(...BusinessGrade::rules('update'));
        $business_grade->update($validated);

        return response()->noContent();
    }

    public function destroy(BusinessGrade $business_grade)
    {
        $business_grade->delete();

        return response()->noContent();
    }
}
