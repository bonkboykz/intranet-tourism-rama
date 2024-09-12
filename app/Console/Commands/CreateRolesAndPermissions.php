<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateRolesAndPermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roles:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Define the roles from the matrix
        $roles = ['superadmin', 'admin', 'user'];

        // Create roles if not exist
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
            $this->info("Role '{$role}' has been created or already exists.");
        }

        $permissionsMatrix = [
            ['name' => 'login', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'single sign-on', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'wall posting', 'roles' => ['superadmin', 'admin']],
            ['name' => 'create post', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'view admin name', 'roles' => ['superadmin', 'admin']],
            ['name' => 'post as a different type of user', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'edit post', 'roles' => ['superadmin', 'admin']],
            ['name' => 'filter post', 'roles' => ['superadmin', 'admin']],
            ['name' => 'set/unset a post as an announcement', 'roles' => ['superadmin', 'admin']],
            ['name' => 'set/unset another user\'s post as an announcement', 'roles' => ['superadmin']],
            ['name' => 'delete own post', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'delete another user\'s post', 'roles' => ['superadmin']],
            ['name' => 'like a post', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'share a post to another department', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'comment on post', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'like a comment on a post', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'edit own comment on a post', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'edit another\'s user comment', 'roles' => ['superadmin']],
            ['name' => 'delete own comment on a post', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'delete another\'s user comment', 'roles' => ['superadmin']],
            ['name' => 'jomla! story', 'roles' => ['superadmin', 'admin']],
            ['name' => 'view stories', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'view the name of admin who create the story', 'roles' => ['superadmin', 'admin']],
            ['name' => 'create story', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'delete own story', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'delete another user\'s story', 'roles' => ['superadmin']],
            ['name' => 'like story', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'create poll', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'view the name of admin who create the poll', 'roles' => ['superadmin', 'admin']],
            ['name' => 'edit own poll', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'delete own poll', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'delete another user\'s poll', 'roles' => ['superadmin']],
            ['name' => 'close own poll', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'close another user\'s poll', 'roles' => ['superadmin']],
            ['name' => 'vote in poll', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'add option in poll after poll is created', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'give feedback on poll after poll is created', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'view online/away/offline users', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'view notifications', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'remove user\'s posting', 'roles' => ['admin']],
            ['name' => 'album or event got tagged', 'roles' => ['superadmin']],
            ['name' => 'post shared by other user', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'search staff member', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'upload files', 'roles' => ['superadmin', 'admin']],
            ['name' => 'view files', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'change own profile', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'change another user\'s profile', 'roles' => ['superadmin']],
            ['name' => 'create album', 'roles' => ['superadmin', 'admin']],
            ['name' => 'delete own album', 'roles' => ['superadmin', 'admin']],
            ['name' => 'delete another admin\'s album', 'roles' => ['superadmin']],
            ['name' => 'add link', 'roles' => ['superadmin']],
            ['name' => 'edit link', 'roles' => ['superadmin']],
            ['name' => 'delete link', 'roles' => ['superadmin']],
            ['name' => 'basic settings', 'roles' => ['superadmin']],
            ['name' => 'theme selection', 'roles' => ['superadmin', 'admin']],
            ['name' => 'advanced settings', 'roles' => ['superadmin']],
            ['name' => 'departments', 'roles' => ['superadmin', 'admin']],
            ['name' => 'roles & permission', 'roles' => ['superadmin']],
            ['name' => 'requests', 'roles' => ['superadmin', 'admin']],
            ['name' => 'audit trail', 'roles' => ['superadmin']],
            ['name' => 'birthday templates', 'roles' => ['superadmin', 'admin']],
            ['name' => 'global search', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'search by filters', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'assign super admin', 'roles' => ['superadmin']],
        ];

        $common_community_management_permissions = [
            ['name' => 'view all public community groups (including archive)', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'view joined private community groups', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'search community group name', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'search all public community group name', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'search joined private community group name', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'filter community groups (private/ public/ archive)', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'join public community group', 'roles' => ['superadmin', 'admin', 'user']],
            ['name' => 'leave community group', 'roles' => ['superadmin', 'admin', 'user']]
        ];

        $super_admin_permissions = [
            ['name' => 'add remove an admin from any group', 'roles' => ['superadmin']]
        ];

        $permissionsMatrix = array_merge($permissionsMatrix, $common_community_management_permissions, $super_admin_permissions);


        foreach ($permissionsMatrix as $permissionData) {
            // Create permission if not exist
            $permission = Permission::firstOrCreate(['name' => $permissionData['name']]);
            $this->info("Permission '{$permission->name}' has been created or already exists.");

            // Assign permission to each role
            foreach ($permissionData['roles'] as $roleName) {
                $role = Role::findByName($roleName);
                if (!$role->hasPermissionTo($permission, 'web')) {
                    $role->givePermissionTo($permission);
                    $this->info("Permission '{$permission->name}' assigned to role '{$roleName}'.");
                }
            }
        }

        $this->info('Roles and permissions synchronization completed.');
        return 0;
    }
}
