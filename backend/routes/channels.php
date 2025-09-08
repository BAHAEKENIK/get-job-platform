<?php

use App\Models\Conversation;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});


Broadcast::channel('conversations.{conversationId}', function ($user, $conversationId) {
    $conversation = Conversation::find($conversationId);
    // Vérifie si l'utilisateur est l'un des deux participants de la conversation
    return $conversation && ($user->id === $conversation->participant1_id || $user->id === $conversation->participant2_id);
});
