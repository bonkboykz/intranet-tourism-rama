<?php

namespace Modules\Department\Helpers;

use Modules\Department\Models\Department;
use Spatie\Permission\Models\Permission;
use Modules\User\Models\User;
use Spatie\Permission\Models\Role;
use Symfony\Component\Console\Output\ConsoleOutput;

class DepartmentPermissionsHelper
{

    public static function assignDepartmentAdminPermissions(User $user, Department $department)
    {
        $departmentPermissions = [
            ['name' => 'edit department details'],
            ['name' => 'add remove an admin from the same department'],
            ['name' => 'add remove staff members from the same department'],
            ['name' => 'view the name of admin who create the post'],
            ['name' => 'set unset post as announcement']
        ];

        // Assign department-specific permissions to the user
        foreach ($departmentPermissions as $permission) {
            // Create a permission specific to this department (e.g., "view department 1")
            $departmentPermissionName = "{$permission['name']} {$department->id}";
            Permission::firstOrCreate(['name' => $departmentPermissionName, 'guard_name' => 'web']);

            // Assign the permission to the user
            $user->givePermissionTo($departmentPermissionName);
        }

        Role::firstOrCreate(['name' => "department admin {$department->id}", 'guard_name' => 'web']);

        // attach specific department admin role
        $user->assignRole("department admin {$department->id}");

        // add to list of department admins
        $department->admins()->attach($user->id);

        // if not already a member of the department, add them
        if (!$department->members->contains($user->id)) {
            $department->members()->attach($user->id, ['role' => 'admin']);
        }
    }

    public static function revokeDepartmentAdminPermissions(User $user, Department $department)
    {
        $departmentPermissions = [
            ['name' => 'edit department details'],
            ['name' => 'add remove an admin from the same department'],
            ['name' => 'add remove staff members from the same department'],
            ['name' => 'view the name of admin who create the post'],
            ['name' => 'set unset post as announcement']
        ];

        // Revoke department-specific permissions from the user
        foreach ($departmentPermissions as $permission) {
            // Create a permission specific to this department (e.g., "view department 1")
            $departmentPermissionName = "{$permission['name']} {$department->id}";
            Permission::firstOrCreate(['name' => $departmentPermissionName, 'guard_name' => 'web']);

            // Revoke the permission from the user
            $user->revokePermissionTo($departmentPermissionName);
        }

        Role::firstOrCreate(['name' => "department admin {$department->id}", 'guard_name' => 'web']);
        // detach specific department admin role
        $user->removeRole("department admin {$department->id}");

        // remove from list of department admins
        $department->admins()->detach($user->id);
    }

    public static function checkSpecificPermission(User $user, string $permission, string $community_id)
    {
        $output = new ConsoleOutput();
        $output->writeln($user->email);


        $specificPermission = "{$permission} {$community_id}";

        $output->writeln($permission);

        $output->writeln($user->hasRole('superadmin') ? 'true' : 'false');

        Permission::firstOrCreate(['name' => $specificPermission, 'guard_name' => 'web']);

        // if user is superadmin, return true
        if ($user->hasRole('superadmin')) {
            return true;
        }

        // if user has the specific permission, return true
        if ($user->hasPermissionTo($specificPermission, 'web')) {
            return true;
        }

        return false;
    }

    public static function isAdmin(User $user, Department $department)
    {
        return $department->admins()
            ->where('users.id', $user->id)  // Explicitly reference users.id
            ->exists();
    }
}

