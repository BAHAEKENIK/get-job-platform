<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\Admin\UserResource;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query()
            ->where('id', '!=', auth()->id()) // Exclure l'admin actuel
            ->latest();

        // Filtrage par nom ou email
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtrage par rôle
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        $users = $query->paginate(15);
        return UserResource::collection($users);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // On empêche l'admin de se modifier lui-même via cet endpoint
        if ($user->id === auth()->id()) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $validated = $request->validate([
            'role' => 'sometimes|string|in:recruiter,candidate',
            'is_active' => 'sometimes|boolean',
        ]);

        $user->update($validated);

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Sécurité : Un admin ne peut pas se supprimer lui-même
        if ($user->id === auth()->id()) {
            return response()->json(['error' => 'Action non autorisée.'], 403);
        }

        $user->delete();

        return response()->noContent();
    }
}
