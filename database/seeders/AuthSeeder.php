<?php

namespace Database\Seeders;

use Modules\User\Models\User;
use Illuminate\Database\Seeder;
use Modules\Crud\Models\Profile;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AuthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedAuth();
    }

    private function seedAuth()
    {
        $superAdminRole = Role::create(['name' => 'superadmin', 'description' => 'Pentadbir Sistem']);
        $adminRole = Role::create(['name' => 'admin_department', 'description' => 'Pentadbir Jabatan']);
        $communityAdminRole = Role::create(['name' => 'admin_community', 'description' => 'Pentadbir Komuniti']);
        $userRole = Role::create(['name' => 'user', 'description' => 'Pengguna']);
        Role::create(['name' => 'new_user', 'description' => 'Pengguna Baru']);

        $permissions = [
            $superAdminRole->id => [
                ['user:all' => 'Manage users'],
                ['profile:all' => 'Manage profiles'],
                ['authorization:all' => 'Manage roles and permission'],
            ],
            $adminRole->id => [
                ['user:department' => 'Manage department users'],
                ['profile:department' => 'Manage department profiles'],
            ],
            $communityAdminRole->id => [
                ['community:all' => 'Manage community members'],
                ['profile:community' => 'Manage community profiles'],
            ],
            $userRole->id => [
                ['user:own' => 'Manage own user'],
                ['profile:own' => 'Manage own profile'],
            ],
        ];

        foreach ($permissions as $roleId => $permissionList) {
            collect($permissionList)->each(fn($item) => Permission::firstOrCreate(['name' => key($item), 'description' => current($item)]));
            $role = Role::findById($roleId);
            $role->givePermissionTo(collect($permissionList)->flatMap(fn($item) => $item)->keys()->toArray());
        }

        $admin = User::factory()->create(['email' => 'admin@enzee.com']);
        Profile::factory()->create(['user_id' => $admin->id, 'bio' => $admin->name]);
        $admin->assignRole($adminRole->name);

        if (!app()->isProduction()) {
            $user = User::factory()->create(['email' => 'test@example.com']);
            Profile::factory()->create(['user_id' => $user->id, 'bio' => $user->name]);
            $user->assignRole($userRole->name);

            User::factory(3)->create()->each(function ($user) use ($adminRole) {
                $user->assignRole($adminRole->name);
                Profile::factory()->create(['user_id' => $user->id, 'bio' => $user->name]);
            });

            User::factory(10)->create()->each(function ($user) use ($userRole) {
                $user->assignRole($userRole->name);
                Profile::factory()->create(['user_id' => $user->id, 'bio' => $user->name]);
            });
        }
    }
}
