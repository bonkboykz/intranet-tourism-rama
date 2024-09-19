<?php

namespace Modules\Crud\Http\Controllers;

use App\Http\Controllers\Controller;
use Auth;
use Modules\Crud\Models\Department;
use Modules\User\Models\User;

class DepartmentController extends Controller
{
    public function index()
    {
        $queryParams = request()->query();
        $limit = request()->query('perpage', 15);

        $department = Department::queryable()->paginate($limit);

        $department->appends($queryParams);

        return response()->json([
            'data' => $department,
        ]);
    }

    public function show($id)
    {
        $data = Department::where('id', $id)->queryable()->firstOrFail();

        $is_member = $data->employmentPosts()->where('user_id', Auth::id())->exists();
        $is_admin = $data->admins()->where('user_id', Auth::id())->exists();

        $user = User::findOrFail(auth()->id());
        $is_superadmin = $user->hasRole('superadmin');

        if ($is_superadmin) {
            $data['is_member'] = true;
            $data['role'] = "superadmin";
        } else if ($is_admin) {
            $data['is_member'] = true;
            $data['role'] = "admin";
        } else if ($is_member) {
            $data["is_member"] = true;
            $data["role"] = "member";
        } else {
            $data['is_member'] = false;
        }


        return response()->json([
            'data' => $data,
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...Department::rules());
        Department::create($validated);

        return response()->noContent();
    }

    public function update(Department $department)
    {
        $validated = request()->validate(...Department::rules('update'));
        $department->update($validated);

        return response()->noContent();
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return response()->noContent();
    }
}
