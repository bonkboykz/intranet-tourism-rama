<?php

namespace Modules\Permission\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Models\User;
use Modules\Permission\Models\ModelHasRole;
use Spatie\Permission\Models\Role;
use Symfony\Component\Console\Output\ConsoleOutput;


class ModelHasRoleController extends Controller
{
    public function index()
    {
        $output = new ConsoleOutput();
        $output->writeln('Hello from the ModelHasRoleController');

        $roleFilters = request()->query('filter');
        $modelId = request()->query('model_id');

        $query = ModelHasRole::with('communities');

        if ($roleFilters) {
            $roleIds = array_map('intval', explode(',', $roleFilters[0]));
            $query->whereIn('role_id', $roleIds);
        }

        if ($modelId) {
            $query->where('model_id', intval($modelId));
        }

        // Fetch the paginated results
        $roles = $query->paginate();

        // Use transform on the collection inside the paginated data
        $roles->getCollection()->transform(function ($role) {
            return [
                'role_id' => $role->role_id,
                'model_id' => $role->model_id,
                'department_id' => $role->department_id,
                'communities' => $role->communities->pluck('community_id'),
            ];
        });

        // Return the transformed results as a JSON response
        return response()->json([
            'data' => $roles,
        ]);
    }


    public function show($id)
    {
        return response()->json([
            'data' => ModelHasRole::where('model_id', $id)->firstOrFail(),
        ]);
    }

    // public function store()
    // {

    //     $user = User::with('roles')->findOrFail(request('model_id'));
    //     $validated = request()->validate(...ModelHasRole::rules('create'));

    //     $roleIds = $validated['role_id'];
    //     $departmentId = $validated['department_id'] ?? null;
    //     $communityId = $validated['community_id'] ?? null;

    //     // Remove all existing roles first
    //     $user->syncRoles([]);

    //     foreach ($roleIds as $roleId) {
    //         $role = Role::findOrFail($roleId);
    //         $user->assignRole($role);

    //         // Attach department_id and community_id to the pivot table
    //         $user->roles()->updateExistingPivot($roleId, [
    //             'department_id' => $departmentId,
    //             'community_id' => $communityId,
    //         ]);
    //     }

    //     $assignedRoles = $user->roles()->get();

    //     return response()->json([
    //         'data' => [
    //             'user' => $user,
    //             'roles' => $assignedRoles,
    //             'department_id' => $departmentId,
    //             'community_id' => $communityId,
    //         ],
    //         'message' => 'User has been assigned to the role.',
    //     ]);
    // }

    public function store()
    {
        $user = User::with('roles')->findOrFail(request('model_id'));
        $validated = request()->validate([
            'role_id' => ['required', 'array'],
            'model_id' => ['required', 'integer'],
            'department_id' => ['nullable', 'integer'],
            'community_id' => ['nullable', 'array'],
            'community_id.*' => ['integer'],
        ]);

        $roleIds = $validated['role_id'];
        $departmentId = $validated['department_id'] ?? null;
        $communityIds = $validated['community_id'] ?? [];

        $user->syncRoles([]);

        foreach ($roleIds as $roleId) {
            $role = Role::findOrFail($roleId);
            $user->assignRole($role);

            $modelHasRole = ModelHasRole::where('model_id', $user->id)->where('role_id', $roleId)->first();

            $user->roles()->updateExistingPivot($roleId, [
                'department_id' => $departmentId,
            ]);

            if ($roleId == 3 && !empty($communityIds)) {
                foreach ($communityIds as $communityId) {
                    $modelHasRole->communities()->attach($communityId, ['role_id' => $roleId]);
                }
            }
        }

        return response()->json([
            'data' => [
                'user' => $user,
                'roles' => $user->roles()->get(),
                'department_id' => $departmentId,
                'community_ids' => $communityIds,
            ],
            'message' => 'User has been assigned to the role and communities (if role is 3).',
        ]);
    }


    public function update($id)
    {
        $user = User::with('roles')->findOrFail($id);
        $validated = request()->validate([
            'role_id' => ['required', 'array'],
            'model_id' => ['required', 'integer'],
            'department_id' => ['nullable', 'integer'],
            'community_id' => ['nullable', 'array'],
            'community_id.*' => ['integer'],
        ]);

        $roleIds = $validated['role_id'];
        $departmentId = $validated['department_id'] ?? null;
        $communityIds = $validated['community_id'] ?? [];

        $user->syncRoles([]);

        foreach ($roleIds as $roleId) {
            $role = Role::findOrFail($roleId);
            $user->assignRole($role);

            $modelHasRole = ModelHasRole::where('model_id', $user->id)->where('role_id', $roleId)->first();

            $user->roles()->updateExistingPivot($roleId, [
                'department_id' => $departmentId,
            ]);

            if ($roleId == 3 && !empty($communityIds)) {
                foreach ($communityIds as $communityId) {
                    $modelHasRole->communities()->attach($communityId, ['role_id' => $roleId]);
                }
            }
        }

        return response()->json([
            'data' => [
                'user' => $user,
                'roles' => $user->roles()->get(),
                'department_id' => $departmentId,
                'community_ids' => $communityIds,
            ],
            'message' => 'User roles have been updated, and communities only assigned for role 3.',
        ]);
    }



    public function destroy(ModelHasRole $modelHasRole)
    {
        $modelHasRole->delete();

        return response()->noContent();
    }

    public function getUsersWithRoles()
    {
        /*
department: {name: 'No department', id: null}
id: 1
image: "/assets/dummyStaffPlaceHolder.jpg"
name: "Admin"
roles: [{…}]
status: false
title: "No title"
        */
        // users who have roles
        $users = User::with(relations: 'roles')->whereHas('roles')->get();

        $users->map(callback: function ($user) {
            $user->department = $user->employmentPosts()->first();

            if ($user->department) {
                $user->department = $user->department->department;
                $user->title = $user->employmentPosts()->first()->position;
            } else {
                $user->department = ['id' => null, 'name' => 'No department'];
                $user->title = 'No title';
            }

            $user->roles = $user->roles()->get();

            $user->image = $user->profile->image;

            if (!$user->image) {
                $user->image = $user->profile->staff_image;
            }

            if (!$user->image) {
                $user->image = '/assets/dummyStaffPlaceHolder.jpg';
            }

            // if image includes avatar place / at the start
            if (strpos($user->image, 'avatar') === 0) {
                $user->image = '/storage/' . $user->image;
            }

            // remove unneded fields
            unset($user->password);
        });


        return response()->json([
            'data' => $users,
        ]);
    }
}
