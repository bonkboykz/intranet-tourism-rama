<?php

namespace Modules\Permission\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Models\User;
use Modules\Permission\Models\ModelHasRole;
use Modules\Permission\Models\RoleHasPermission;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleHasPermissionController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => $this->shouldPaginate(RoleHasPermission::queryable()),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => RoleHasPermission::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {

        $validated = request()->validate(...RoleHasPermission::rules());

        $role_id = $validated['role_id'];
        $permission_ids = $validated['permission_id'];

        $role = Role::findOrFail($role_id);

        foreach ($permission_ids as $permission_id) {
            $permission = Permission::findOrFail($permission_id);
            $role->givePermissionTo($permission);
        }

        $assignedPermissions = $role->permissions()->get();

        return response()->json([
            'data' => [
                'role_id' => $role_id,
                'permissions' => $assignedPermissions,
            ],
            'message' => 'Permissions assigned successfully to the role.',
        ]);
    }

    public function update($id)
    {

        $validated = request()->validate(...RoleHasPermission::rules('update'));

        $role_id = $validated['role_id'];
        $permission_ids = $validated['permission_id'];

        $role = Role::findOrFail($id);

        $role->permissions()->detach();

        foreach ($permission_ids as $permission_id) {
            $permission = Permission::findOrFail($permission_id);
            $role->givePermissionTo($permission);
        }

        $updatedPermissions = $role->permissions()->get();

        return response()->json([
            'data' => [
                'role_id' => $role_id,
                'permissions' => $updatedPermissions,
            ],
            'message' => 'Permissions updated successfully for the role.',
        ]);
    }

    public function destroy(RoleHasPermission $roleHasPermission)
    {
        $roleHasPermission->delete();

        return response()->noContent();
    }
}
