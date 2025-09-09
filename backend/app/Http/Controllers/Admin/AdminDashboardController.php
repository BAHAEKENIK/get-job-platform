<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Job;
use App\Models\Application;
use Illuminate\Support\Facades\DB; // Important pour les requêtes brutes

class AdminDashboardController extends Controller
{
    /**
     * Récupère un ensemble de statistiques pour le tableau de bord de l'admin.
     */
    public function getStats()
    {
        // 1. Chiffres clés simples
        $totalUsers = User::count();
        $totalJobs = Job::count();
        $totalApplications = Application::count();

        // 2. Répartition des utilisateurs par rôle
        // C'est une requête plus complexe qui groupe les utilisateurs par leur rôle et les compte.
        $roleDistribution = User::query()
            ->select('role', DB::raw('count(*) as total'))
            ->groupBy('role')
            ->get();

        // 3. (Bonus) Statistiques sur les X derniers jours
        $applicationsLast30Days = Application::where('created_at', '>=', now()->subDays(30))->count();
        $jobsLast30Days = Job::where('created_at', '>=', now()->subDays(30))->count();


        // 4. Retourner toutes les données dans une seule réponse JSON
        return response()->json([
            'key_figures' => [
                'total_users' => $totalUsers,
                'total_jobs' => $totalJobs,
                'total_applications' => $totalApplications,
            ],
            'role_distribution' => $roleDistribution,
            'activity_last_30_days' => [
                'new_applications' => $applicationsLast30Days,
                'new_jobs' => $jobsLast30Days,
            ]
        ]);
    }
}
