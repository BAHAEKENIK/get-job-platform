<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => fake()->jobTitle(),
            'description' => fake()->paragraphs(5, true), // 5 paragraphes de texte
            'location' => fake()->city() . ', ' . fake()->country(),
            'contract_type' => fake()->randomElement(['Full-time', 'Part-time', 'Contract']),
            'salary_amount' => fake()->numberBetween(30000, 120000),
            'salary_currency' => fake()->randomElement(['USD', 'EUR', 'MAD']),
        ];
    }
}
