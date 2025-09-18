<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('password123'), // Tous les utilisateurs auront 'password' comme mdp
            'remember_token' => Str::random(10),
            'role' => fake()->randomElement(['recruiter', 'candidate']), // Rôle aléatoire
            'is_active' => true,
        ];
    }
}
