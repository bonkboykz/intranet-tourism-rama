<?php

namespace Modules\Communities\Helpers;

use Spatie\Permission\Models\Permission;
use Modules\User\Models\User;
use Modules\Communities\Models\Community;
use Spatie\Permission\Models\Role;
use Symfony\Component\Console\Output\ConsoleOutput;

class CommunityPermissionsHelper
{

    public static function assignCommunityAdminPermissions(User $user, Community $community)
    {
        $communityPermissions = [
            ['name' => 'edit community group details'],
            ['name' => 'add remove an admin from the same group'],
            ['name' => 'add remove staff members from the same group'],
            ['name' => 'view the name of admin who create the post'],
            ['name' => 'set unset post as announcement']
        ];

        // Assign community-specific permissions to the user
        foreach ($communityPermissions as $permission) {
            // Create a permission specific to this community (e.g., "view community 1")
            $communityPermissionName = "{$permission['name']} {$community->id}";
            Permission::firstOrCreate(['name' => $communityPermissionName, 'guard_name' => 'web']);

            // Assign the permission to the user
            $user->givePermissionTo($communityPermissionName);
        }

        Role::firstOrCreate(['name' => "community admin {$community->id}", 'guard_name' => 'web']);

        // attach specific community admin role
        $user->assignRole("community admin {$community->id}");

        // add to list of community admins
        $community->admins()->attach($user->id);

        // if not already a member of the community, add them
        if (!$community->members->contains($user->id)) {
            $community->members()->attach($user->id, ['role' => 'admin']);
        }
    }

    public static function revokeCommunityAdminPermissions(User $user, Community $community)
    {
        $communityPermissions = [
            ['name' => 'edit community group details'],
            ['name' => 'add remove an admin from the same group'],
            ['name' => 'add remove staff members from the same group'],
            ['name' => 'view the name of admin who create the post'],
            ['name' => 'set unset post as announcement']
        ];

        // Revoke community-specific permissions from the user
        foreach ($communityPermissions as $permission) {
            // Create a permission specific to this community (e.g., "view community 1")
            $communityPermissionName = "{$permission['name']} {$community->id}";
            Permission::firstOrCreate(['name' => $communityPermissionName, 'guard_name' => 'web']);

            // Revoke the permission from the user
            $user->revokePermissionTo($communityPermissionName);
        }

        // detach specific community admin role
        $user->removeRole("community admin {$community->id}");

        // remove from list of community admins
        $community->admins()->detach($user->id);

        // if in the list of members, demote to member
        if ($community->members->contains($user->id)) {
            $community->members()->updateExistingPivot($user->id, ['role' => 'member']);
        }
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
}
