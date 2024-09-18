<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class SettingsSeeder extends Seeder
{
    public function run()
    {
        DB::table('settings')->insert([
            [
                'group' => 'UI',
                'key' => 'logo',
                'value' => '/assets/Jomla logo red.svg',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'FUNCTIONALITY',
                'key' => 'wall_enabled',
                'value' => 'true',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'FUNCTIONALITY',
                'key' => 'calendar_enabled',
                'value' => 'true',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'STORAGE',
                'key' => 'max_file_size',
                'value' => '10MB',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'MAIL',
                'key' => 'smtp_host',
                'value' => 'localhost',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'MAIL',
                'key' => 'smtp_port',
                'value' => '25',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'MAIL',
                'key' => 'smtp_username',
                'value' => 'admin',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'MAIL',
                'key' => 'smtp_password',
                'value' => bcrypt('password'),
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'MAIL',
                'key' => 'smtp_security',
                'value' => 'none',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'FUNCTIONALITY',
                'key' => 'member_invites_enabled',
                'value' => 'true',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'TEMPLATES',
                'key' => 'birthday_wish_template',
                'value' => 'Happy Birthday, {{name}}! Wishing you all the best!',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ]);
    }
}
