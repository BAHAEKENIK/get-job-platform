<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Conversation;
use App\Models\Job;
use App\Models\User;
use App\Notifications\GeneralNotification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // On s'assure qu'il n'y ait aucun autre utilisateur avec cet email avant de le créer.
        $adminEmail = 'bahaekenik@gmail.com';
        User::where('email', $adminEmail)->delete();

        // 1. On utilise "create" directement au lieu de la factory pour l'admin
        // C'est plus sûr et évite tout conflit.
        $admin = User::create([
            'name' => 'bahae kenikssi',
            'email' => $adminEmail,
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true
        ]);

        // 2. Création des Recruteurs et Candidats

    }
}
