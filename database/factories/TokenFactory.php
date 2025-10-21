<?php

namespace Database\Factories;

use App\Models\Token;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Token>
 */
class TokenFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // This will create a new user for each token
            'name' => $this->faker->name(),
            'symbol' => Str::upper(substr($this->faker->name(), 0, 3)),
            'description' => $this->faker->text(),
            'decimals' => 9,
            'supply' => 1000000000,
        ];
    }
}
