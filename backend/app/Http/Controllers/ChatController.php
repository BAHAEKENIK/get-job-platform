<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use App\Events\NewMessageSent; // L'import pour l'événement temps réel du chat
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use App\Notifications\GeneralNotification; // L'import pour les notifications visibles

class ChatController extends Controller
{
    // Récupérer la liste de toutes les conversations de l'utilisateur
    public function getConversations()
    {
        $user = auth()->user();
        $conversations = Conversation::where('participant1_id', $user->id)
            ->orWhere('participant2_id', $user->id)
            ->with(['participant1', 'participant2', 'messages' => function ($query) {
                $query->latest();
            }])
            ->get();

        return ConversationResource::collection($conversations);
    }

    // Récupérer les messages d'une conversation spécifique
    public function getMessages(Conversation $conversation, Request $request)
    {
        if ($request->user()->id !== $conversation->participant1_id && $request->user()->id !== $conversation->participant2_id) {
            return response()->json(['error' => 'Non autorisé.'], 403);
        }

        return MessageResource::collection($conversation->messages()->oldest()->get());
    }

    // Démarrer une conversation (MODIFIÉ)
    public function startConversation(Request $request)
    {
        $request->validate(['user_id' => 'required|exists:users,id']);
        $otherUserId = $request->input('user_id');
        $user = auth()->user();

        // Vérifie si une conversation existe déjà
        $conversation = Conversation::where(function ($query) use ($user, $otherUserId) {
            $query->where('participant1_id', $user->id)
                  ->where('participant2_id', $otherUserId);
        })->orWhere(function ($query) use ($user, $otherUserId) {
            $query->where('participant1_id', $otherUserId)
                  ->where('participant2_id', $user->id);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'participant1_id' => $user->id,
                'participant2_id' => $otherUserId,
            ]);
        }

        // --- RENVOI DE LA RESSOURCE COMPLÈTE ---
        return new ConversationResource(
            $conversation->load([
                'participant1',
                'participant2',
                'messages' => fn($q) => $q->latest()
            ])
        );
    }

    // Envoyer un message dans une conversation
    public function sendMessage(Request $request, Conversation $conversation)
    {
        if ($request->user()->id !== $conversation->participant1_id && $request->user()->id !== $conversation->participant2_id) {
            return response()->json(['error' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'content' => 'nullable|string',
            'file' => 'nullable|file|max:5120',
        ]);

        if (empty($validated['content']) && !$request->hasFile('file')) {
            return response()->json(['error' => 'Un message ou un fichier est requis.'], 422);
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('chat_files', 'public');
        }

        $message = $conversation->messages()->create([
            'user_id' => auth()->id(),
            'content' => $validated['content'] ?? null,
            'file_path' => $filePath,
        ]);

        // --- SECTION NOTIFICATION VISIBLE (CLOCHE) ---
        $recipient = $conversation->participant1_id === auth()->id()
            ? $conversation->participant2
            : $conversation->participant1;

        $notificationMessage = "Vous avez reçu un nouveau message de " . auth()->user()->name;
        $url = "/chat";
        $recipient->notify(new GeneralNotification($notificationMessage, $url));

        // --- SECTION TEMPS RÉEL (MET À JOUR L'UI DU CHAT) ---
        broadcast(new NewMessageSent($message->load('user')));

        return new MessageResource($message);
    }
}
