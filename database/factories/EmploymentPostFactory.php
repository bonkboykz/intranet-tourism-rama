<?php

namespace Database\Factories;

use Modules\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Crud\Models\BusinessGrade;
use Modules\Crud\Models\BusinessPost;
use Modules\Crud\Models\BusinessScheme;
use Modules\Crud\Models\BusinessUnit;
use Modules\Crud\Models\Department;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class EmploymentPostFactory extends Factory
{
    protected $model = \Modules\Crud\Models\EmploymentPost::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'department_id' => Department::first()->id,
            'business_unit_id' => BusinessUnit::first()->id,
            'business_post_id' => BusinessPost::first()->id,
            'business_grade_id' => BusinessGrade::first()->id,
            'business_scheme_id' => BusinessScheme::first()->id,
            'user_id' => User::first()->id
        ];
    }
}
