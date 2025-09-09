<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckAdminRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
{
    // On vérifie si l'utilisateur est authentifié ET si son rôle est 'admin'
    if (Auth::check() && Auth::user()->role === 'admin') {
        // Si c'est le cas, on laisse la requête continuer
        return $next($request);
    }

    // Sinon, on renvoie une erreur 403 (Accès Interdit)
    return response()->json(['error' => 'Accès non autorisé.'], 403);
}
}
