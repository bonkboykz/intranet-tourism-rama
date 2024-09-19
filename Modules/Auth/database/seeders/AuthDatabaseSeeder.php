<?php

namespace Modules\Auth\Database\Seeders;

use Modules\User\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AuthDatabaseSeeder extends Seeder
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
        $adminRole = Role::create(['name' => 'Pentadbir Sistem', 'description' => 'Pentadbir Sistem']);
        $userRole = Role::create(['name' => 'Pengguna', 'description' => 'Pengguna']);
        Role::create(['name' => 'Pengguna Baru', 'description' => 'Pengguna Baru']);

        $permissions = [
            $adminRole->id => [
                ['user:all' => 'Manage users'],
                ['profile:all' => 'Manage user profiles'],
                ['authorization:all' => 'Manage roles and permission'],
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

        $admin = User::factory()->create(['email' => 'admin@rekamy.com']);
        $admin->assignRole($adminRole->name);

        if (!app()->isProduction()) {
            $user = User::factory()->create(['email' => 'user@mail.com']);
            $user->assignRole($userRole->name);

            User::factory(3)->create()->each(function ($user) use ($adminRole) {
                $user->assignRole($adminRole->name);
            });

            User::factory(10)->create()->each(function ($user) use ($userRole) {
                $user->assignRole($userRole->name);
            });
        }
    }
}
