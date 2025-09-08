<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\Application;
use Illuminate\Http\Request;
use App\Http\Resources\ApplicationResource;
use App\Notifications\GeneralNotification;
use Illuminate\Support\Facades\Auth;

class ApplicationController extends Controller
{
    /**
     * Permet à un candidat de postuler à une offre.
     */
    public function apply(Request $request, Job $job)
    {
        // 1. Autorisation : L'utilisateur doit être un candidat
        if ($request->user()->role !== 'candidate') {
            return response()->json(['error' => 'Seuls les candidats peuvent postuler.'], 403);
        }

        // 2. Validation des données
        $request->validate([
            'cv' => 'required|file|mimes:pdf|max:2048', // CV obligatoire, PDF, max 2Mo
        ]);

        // 3. Vérifier si l'utilisateur a déjà postulé
        $existingApplication = Application::where('user_id', $request->user()->id)
                                         ->where('job_id', $job->id)
                                         ->exists();

        if ($existingApplication) {
            return response()->json(['error' => 'Vous avez déjà postulé à cette offre.'], 409); // 409 Conflict
        }

        // 4. Gestion du téléversement
        $cvPath = $request->file('cv')->store('cvs', 'public'); // Stocke dans storage/app/public/cvs

        // 5. Création de la candidature
        $application = Application::create([
            'user_id' => $request->user()->id,
            'job_id' => $job->id,
            'cv_path' => $cvPath,
        ]);
        $recruiter = $job->user; // On récupère l'utilisateur qui a posté l'offre
        $candidateName = $request->user()->name;
        $message = "Vous avez reçu une nouvelle candidature de {$candidateName} pour l'offre '{$job->title}'.";
        $url = "/recruiter/jobs/{$job->id}/manage"; // Lien direct vers la page de gestion

        // On envoie la notification
        $recruiter->notify(new GeneralNotification($message, $url));

        return new ApplicationResource($application);
    }

    /**
     * Récupère les candidatures reçues pour une offre spécifique d'un recruteur.
     */
    public function getForRecruiter(Request $request, Job $job)
    {
         // Autorisation : L'utilisateur doit être le propriétaire de l'offre
        if ($request->user()->id !== $job->user_id) {
            return response()->json(['error' => 'Non autorisé.'], 403);
        }

        // Pré-charge les informations du candidat pour l'efficacité
        $applications = $job->applications()->with('user')->latest()->get();

        return ApplicationResource::collection($applications);
    }

    /**
     * Récupère les candidatures envoyées par le candidat connecté.
     */
    public function getForCandidate(Request $request)
    {
         // Autorisation : L'utilisateur doit être un candidat
        if ($request->user()->role !== 'candidate') {
            return response()->json(['error' => 'Non autorisé.'], 403);
        }

        $user = $request->user();
        // Pré-charge les informations de l'offre pour l'efficacité
        $applications = $user->applications()->with('job')->latest()->get();

        return ApplicationResource::collection($applications);
    }
}
