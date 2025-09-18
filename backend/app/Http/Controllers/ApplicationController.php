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
        if ($request->user()->role !== 'candidate') {
            return response()->json(['error' => 'Seuls les candidats peuvent postuler.'], 403);
        }

        $request->validate(['cv' => 'required|file|mimes:pdf|max:2048']);

        if (Application::where('user_id', $request->user()->id)->where('job_id', $job->id)->exists()) {
            return response()->json(['error' => 'Vous avez déjà postulé à cette offre.'], 409);
        }

        $cvPath = $request->file('cv')->store('cvs', 'public');

        $application = Application::create([
            'user_id' => $request->user()->id,
            'job_id' => $job->id,
            'cv_path' => $cvPath,
        ]);

        $recruiter = $job->user;
        $candidateName = $request->user()->name;
        $message = "Nouvelle candidature de {$candidateName} pour '{$job->title}'.";
        $url = "/recruiter/jobs/{$job->id}/manage";
        $recruiter->notify(new GeneralNotification($message, $url));

        return new ApplicationResource($application);
    }

    /**
     * Récupère les candidatures reçues pour une offre spécifique d'un recruteur.
     */
    public function getForRecruiter(Request $request, Job $job)
    {
        if ($request->user()->id !== $job->user_id) {
            return response()->json(['error' => 'Non autorisé.'], 403);
        }

        // --- MODIFICATION ICI ---
        // On remplace get() par paginate()
        // La méthode `with()` pour pré-charger les infos du candidat est conservée pour l'efficacité.
        $applications = $job->applications()->with('user')->latest()->paginate(10);

        return ApplicationResource::collection($applications);
    }

    /**
     * Récupère les candidatures envoyées par le candidat connecté.
     */
    public function getForCandidate(Request $request)
    {
        if ($request->user()->role !== 'candidate') {
            return response()->json(['error' => 'Non autorisé.'], 403);
        }
        $applications = $request->user()->applications()->with('job')->latest()->get();
        return ApplicationResource::collection($applications);
    }

    /**
     * Met à jour le statut d'une candidature.
     */
    public function updateStatus(Request $request, Application $application)
    {
        // 1. Autorisation
        if ($request->user()->id !== $application->job->user_id) {
            return response()->json(['error' => 'Non autorisé.'], 403);
        }

        // 2. Validation
        $validated = $request->validate([
            'status' => 'required|string|in:pending,viewed,accepted,rejected',
        ]);

        // 3. Mise à jour (cela fonctionne, c'est pour ça que la BDD est modifiée)
        $application->update(['status' => $validated['status']]);

        // 4. Notification (C'est cette partie qui ne s'exécutait pas à cause du crash)
        $candidate = $application->user;
        $jobTitle = $application->job->title;
        $statusFrancais = ['pending' => 'en attente', 'viewed' => 'consultée', 'accepted' => 'acceptée', 'rejected' => 'rejetée'];

        $message = "Votre candidature pour '{$jobTitle}' est maintenant : " . $statusFrancais[$validated['status']];
        $url = "/my-applications";
        $candidate->notify(new GeneralNotification($message, $url));

        // 5. Réponse
        return new ApplicationResource($application);
    }
}
