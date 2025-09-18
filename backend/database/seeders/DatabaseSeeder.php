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
        $recruiters = User::factory(10)->create(['role' => 'recruiter']);
        $candidates = User::factory(10)->create(['role' => 'candidate']);

        // 3. Création des Offres
        $jobs = Job::factory(20)->sequence(fn() => ['user_id' => $recruiters->random()->id])->create();

        // 4. Création des Candidatures
        $candidatesToApply = $candidates->take(5);
        $jobsToApplyTo = $jobs->take(15);

        foreach ($candidatesToApply as $candidate) {
            foreach ($jobsToApplyTo->random(3) as $job) {
                // S'assurer de ne pas créer de doublons
                Application::firstOrCreate(
                    ['user_id' => $candidate->id, 'job_id' => $job->id],
                    ['cv_path' => 'cvs/placeholder.pdf', 'status' => 'pending']
                );

                // Notification au recruteur
                $recruiter = $job->user;
                $message = "Nouvelle candidature de {$candidate->name} pour '{$job->title}'.";
                $recruiter->notify(new GeneralNotification($message, "/recruiter/jobs/{$job->id}/manage"));
            }
        }

        // 5. Création de Conversations et Messages
        $firstRecruiter = $recruiters->first();
        $firstCandidate = $candidates->first();

        if ($firstRecruiter && $firstCandidate) {
            $conversation = Conversation::create([
                'participant1_id' => $firstRecruiter->id,
                'participant2_id' => $firstCandidate->id,
            ]);

            $conversation->messages()->create([
                'user_id' => $firstRecruiter->id,
                'content' => 'Bonjour, votre profil nous intéresse !',
            ]);
            $firstCandidate->notify(new GeneralNotification("Nouveau message de {$firstRecruiter->name}", "/chat"));

            $conversation->messages()->create([
                'user_id' => $firstCandidate->id,
                'content' => 'Bonjour, merci ! Je suis disponible pour un entretien.',
            ]);
             $firstRecruiter->notify(new GeneralNotification("Nouveau message de {$firstCandidate->name}", "/chat"));
        }
    }
}
