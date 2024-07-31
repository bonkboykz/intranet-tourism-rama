<?php

namespace Modules\Department\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Department\Models\Department;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Department::queryable()->paginate(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => Department::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        DB::beginTransaction();
        try {

            $validated = request()->validate(...Department::rules());
            $imagePath = null;
            if (request()->hasFile('banner')) {
                $imagePath = uploadFile(request()->file('banner'), null, 'banner')['path'];
            }

            Department::create(array_merge($validated, ['banner' => $imagePath]));

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }

        return response()->noContent();
    }

    public function update( Department $department)
    {
        DB::beginTransaction();
        try {

            $validated = request()->validate(...Department::rules('update'));


            $imagePath = $department->banner;
            if (request()->hasFile('banner')) {

                if ($imagePath) {
                    Storage::delete($imagePath);
                }

                $imagePath = uploadFile(request()->file('banner'), null, 'banner')['path'];
            }

           
            $department->update(array_merge($validated, ['banner' => $imagePath]));

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }

        return response()->noContent();
    }



    public function destroy(Department $department)
    {
        $department->delete();

        return response()->noContent();
    }
}
