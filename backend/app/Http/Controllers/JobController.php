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
        $query = Job::query()->with('user')->latest();

        if ($request->filled('keyword')) {
            $keyword = $request->input('keyword');
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        if ($request->filled('location')) {
            $location = $request->input('location');
            $query->where('location', 'like', "%{$location}%");
        }

        // --- LA MODIFICATION EST ICI ---
        // .withQueryString() ajoute les paramètres de recherche aux liens de pagination.
        // C'est essentiel pour que les filtres persistent quand on change de page.
        $jobs = $query->paginate(3)->withQueryString();

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
        return new JobResource($job->load('user'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Job $job)
    {
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
        if ($request->user()->id !== $job->user_id && $request->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $job->delete();

        return response()->noContent();
    }

    public function myJobs(Request $request)
    {
        if($request->user()->role !== 'recruiter')
        {
            return response()->json(['error'=>'Unauthorized.'],403);
        }
        $jobs=$request->user()->jobs()->latest()->get();

        return JobResource::collection($jobs);
    }
    public function adminIndex(Request $request)
    {
        $query = Job::query()->with('user')->latest();

        // Réutiliser les filtres de la méthode index() si nécessaire
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $jobs = $query->paginate(15);

        return JobResource::collection($jobs);
    }

}
