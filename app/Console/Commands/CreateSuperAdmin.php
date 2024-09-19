<?php

namespace App\Console\Commands;

use Illuminate\Support\Facades\Hash;
use Illuminate\Console\Command;
use Modules\User\Models\User;
use Spatie\Permission\Models\Role;
use Symfony\Component\Console\Output\ConsoleOutput;

class CreateSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'superadmin:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $password = $this->ask('What password?');

        $user = User::firstOrCreate([
            'name' => 'Admin',
            'email' => 'admin@tourism.gov.my',
            'password' => Hash::make($password)
        ]);

        $existing_role = Role::firstOrCreate(['name' => 'superadmin']);

        $user->assignRole($existing_role->name);
    }
}
