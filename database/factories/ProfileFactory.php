<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Modules\Crud\Models\Profile;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\Modules\User\Models\User>
 */
class ProfileFactory extends Factory
{

    protected $model = \Modules\Crud\Models\Profile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => fake()->numberBetween(1, 10),
            'bio' => fake()->name(),
            'phone_no' => fake()->phoneNumber(),
            'dob' => fake()->date(),
        ];
    }
}
