<?php

namespace Modules\Department\Http\Controllers;

use App\Http\Controllers\Controller;
use DB;
use Modules\Department\Models\BusinessUnit;
use Illuminate\Http\Request;
use Modules\Department\Models\EmploymentPost;

class BusinessUnitController extends Controller
{
    public function index(Request $request)
    {
        $limit = request()->get('perpage', 15);

        $query = BusinessUnit::query();

        if ($request->has('department_id')) {
            $departmentId = $request->query('department_id');
            $query->where('department_id', $departmentId);
        }

        return response()->json($query->paginate($limit));
    }

    public function show($id)
    {
        return response()->json([
            'data' => BusinessUnit::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    // public function store()
    // {
    //     $validated = request()->validate(...BusinessUnit::rules());
    //     BusinessUnit::create($validated);

    //     return response()->noContent();
    // }

    public function store()
    {
        $validated = request()->validate(...BusinessUnit::rules());
        $businessPost = BusinessUnit::create($validated);

        return response()->json([
            'data' => $businessPost,
        ], 201);
    }

    public function update(BusinessUnit $business_unit)
    {
        $validated = request()->validate(...BusinessUnit::rules('update'));
        $business_unit->update($validated);

        return response()->noContent();
    }

    public function destroy(BusinessUnit $business_unit)
    {
        try {
            DB::beginTransaction();

            // 1. find all employment_posts with such business_unit
            $employment_posts = EmploymentPost::where('business_unit_id', $business_unit->id)->get();

            // 2. find business unit with title "No Title"
            $no_title_business_unit = BusinessUnit::where('name', 'No Unit')->first();

            // 2.1 If not found, create one
            if (!$no_title_business_unit) {
                $no_title_business_unit = BusinessUnit::create([
                    'name' => 'No Unit',
                    'department_id' => $business_unit->department_id,
                ]);
            }

            // 3. transfer all found employment_posts to business unit with title "No Title"
            foreach ($employment_posts as $employment_post) {
                $employment_post->update([
                    'business_unit_id' => $no_title_business_unit->id,
                ]);
            }

            // 4. delete business post
            $business_unit->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to delete business unit',
                'error' => $e->getMessage(),
            ], 500);
        }

        return response()->noContent();
    }
}
