<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use App\Events\NewMessageSent;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;

class ChatController extends Controller
{
    // Récupérer la liste de toutes les conversations de l'utilisateur
    public function getConversations()
    {
        $user = auth()->user();
        $conversations = Conversation::where('participant1_id', $user->id)
            ->orWhere('participant2_id', $user->id)
            ->with(['participant1', 'participant2', 'messages' => function ($query) {
                $query->latest(); // pour le last_message
            }])
            ->get();

        return ConversationResource::collection($conversations);
    }

    // Récupérer les messages d'une conversation spécifique
    public function getMessages(Conversation $conversation)
    {
        // TODO: Autorisation pour vérifier si l'utilisateur fait partie de la conversation
        return MessageResource::collection($conversation->messages()->oldest()->get());
    }

    // Démarrer une conversation (typiquement un recruteur avec un candidat)
    public function startConversation(Request $request)
    {
        $request->validate(['user_id' => 'required|exists:users,id']);
        $otherUserId = $request->input('user_id');
        $user = auth()->user();

        // Vérifie si une conversation existe déjà
        $conversation = Conversation::where(function ($query) use ($user, $otherUserId) {
            $query->where('participant1_id', $user->id)->where('participant2_id', $otherUserId);
        })->orWhere(function ($query) use ($user, $otherUserId) {
            $query->where('participant1_id', $otherUserId)->where('participant2_id', $user->id);
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'participant1_id' => $user->id,
                'participant2_id' => $otherUserId,
            ]);
        }

        return new ConversationResource($conversation->load(['participant1', 'participant2']));
    }

    // Envoyer un message dans une conversation
    public function sendMessage(Request $request, Conversation $conversation)
    {
        // TODO: Autorisation pour vérifier si l'utilisateur fait partie de la conversation
        $validated = $request->validate([
            'content' => 'nullable|string',
            'file' => 'nullable|file|max:5120', // 5Mo max
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

        // Diffuser l'événement
        broadcast(new NewMessageSent($message->load('user')))->toOthers();

        return new MessageResource($message);
    }
}
