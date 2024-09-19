<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Modules\User\Models\User;
use Modules\Crud\Models\BusinessGrade;
use Modules\Crud\Models\BusinessPost;
use Modules\Crud\Models\BusinessScheme;
use Modules\Crud\Models\BusinessUnit;
use Modules\Crud\Models\Department;
use Modules\Crud\Models\EmploymentPost;
use Modules\Crud\Models\Profile;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::factory()->create();
        Profile::factory()->create(['user_id' => $user->id]);

        $department = Department::factory()->create(['name' => 'Jabatan Perdana Menteri']);
        BusinessUnit::factory()->create(['name' => 'Unit Kewangan', 'department_id' => $department->id]);
        BusinessPost::factory()->create(['title' => 'Pegawai Kewangan']);
        BusinessGrade::factory()->create(['code' => '52']);
        BusinessScheme::factory()->create(['code' => 'M', 'title' => 'Skim Perhidmatan Kewangan']);
        EmploymentPost::factory()->create(['user_id' => $user->id]);
    }
}
