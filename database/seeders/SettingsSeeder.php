<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use DB;

class SettingsSeeder extends Seeder
{
    public function run()
    {
        $settings = [
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
                'value' => '1',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'FUNCTIONALITY',
                'key' => 'calendar_enabled',
                'value' => '1',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'FUNCTIONALITY',
                'key' => 'notifications_enabled',
                'value' => '1',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'FUNCTIONALITY',
                'key' => 'pages_enabled',
                'value' => '1',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'FUNCTIONALITY',
                'key' => 'polls_enabled',
                'value' => '1',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'FUNCTIONALITY',
                'key' => 'organisation_chart_enabled',
                'value' => '1',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'STORAGE',
                'key' => 'max_file_size',
                'value' => '20MB',
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
                'value' => '1',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'TEMPLATES',
                'key' => 'birthday_wish_template',
                'value' => 'Happy Birthday, {{name}}! Wishing you all the best!',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'STORAGE',
                'key' => 'max_video_size',
                'value' => '20MB',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'STORAGE',
                'key' => 'max_image_size',
                'value' => '20MB',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'COVER_PHOTOS',
                'key' => 'groups_enabled',
                'value' => '1',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'group' => 'COVER_PHOTOS',
                'key' => 'profiles_enabled',
                'value' => '1',
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];


        foreach ($settings as $setting) {
            DB::table('settings')->updateOrInsert(
                ['group' => $setting['group'], 'key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            );
        }
    }
}
