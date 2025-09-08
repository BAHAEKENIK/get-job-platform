<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
{
    // Déterminer qui est l'autre participant
    $otherParticipant = $this->participant1_id === $request->user()->id
        ? $this->participant2
        : $this->participant1;

    return [
        'id' => $this->id,
        'with_user' => [
            'id' => $otherParticipant->id,
            'name' => $otherParticipant->name,
        ],
        'last_message' => new MessageResource($this->messages()->latest()->first()) // Inclut le dernier message
    ];
}
}
