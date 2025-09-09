<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


class ForgotPasswordController extends Controller
{
    // Gère la demande de lien de réinitialisation
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Envoie la notification de réinitialisation intégrée à Laravel
        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Lien de réinitialisation envoyé par e-mail.']);
        }

        // Si le lien n'est pas envoyé (par exemple, email non trouvé)
        return response()->json(['error' => 'Impossible d\'envoyer le lien.'], 400);
    }

    // Gère la mise à jour effective du mot de passe
    public function reset(Request $request)
    {
         $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        // Logique manuelle car l'API n'est pas "stateful"
        // Vérifie le token dans la base de données
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$resetRecord) {
             return response()->json(['error' => 'Token invalide.'], 400);
        }

        // Met à jour l'utilisateur
        $user = User::where('email', $request->email)->firstOrFail();
        $user->password = Hash::make($request->password);
        $user->save();

        // Supprime le token pour qu'il ne soit pas réutilisé
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès.']);
    }
}
