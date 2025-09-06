<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use App\Http\Resources\JobResource;
use Illuminate\Support\Facades\Gate;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Job::query()->with('user')->latest(); // Pré-charge la relation user et trie par plus récent

        // Barre de recherche par mot-clé (cherche dans le titre et la description)
        if ($request->filled('keyword')) {
            $keyword = $request->input('keyword');
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        // Filtre par localisation
        if ($request->filled('location')) {
            $location = $request->input('location');
            $query->where('location', 'like', "%{$location}%");
        }

        // Paginer les résultats pour de meilleures performances
        $jobs = $query->paginate(10);

        return JobResource::collection($jobs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->user()->role !== 'recruiter') {
            return response()->json(['error' => 'Unauthorized. Only recruiters can post jobs.'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'contract_type' => 'required|string|in:Full-time,Part-time,Contract,Internship',
            'salary_amount' => 'nullable|numeric|min:0',
            'salary_currency' => 'nullable|string|max:3',
        ]);

        $job = $request->user()->jobs()->create($validatedData);

        return new JobResource($job);
    }

    /**
     * Display the specified resource.
     */
    public function show(Job $job)
    {
        // Charger la relation 'user' pour l'afficher
        return new JobResource($job->load('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Job $job)
    {
        // Vérifie que l'utilisateur est le propriétaire de l'offre
        if ($request->user()->id !== $job->user_id) {
             return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'location' => 'sometimes|required|string|max:255',
            'contract_type' => 'sometimes|required|string|in:Full-time,Part-time,Contract,Internship',
            'salary_amount' => 'nullable|numeric|min:0',
            'salary_currency' => 'nullable|string|max:3',
        ]);

        $job->update($validatedData);

        return new JobResource($job);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Job $job)
    {
        // Vérifie que l'utilisateur est soit le propriétaire, soit un admin
        if ($request->user()->id !== $job->user_id && $request->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $job->delete();

        return response()->noContent(); // Réponse standard pour une suppression réussie
    }
    public function myJobs(Request $request)
    {
        if($request->user()->role!=='recruiter')
        {
            return response()->json(['error'=>'Unauthorized.'],403);
        }
        $jobs=$request->user()->jobs()->latest()->get();

        return JobResource::collection($jobs);
    }
}
