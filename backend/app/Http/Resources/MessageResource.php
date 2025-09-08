<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
{
    return [
        'id' => $this->id,
        'content' => $this->content,
        'file_url' => $this->file_path ? asset('storage/' . $this->file_path) : null,
        'sent_at' => $this->created_at->format('Y-m-d H:i:s'),
        'read_at' => $this->read_at ? $this->read_at->format('Y-m-d H:i:s') : null,
        'sender' => [
            'id' => $this->user->id,
            'name' => $this->user->name,
        ]
    ];
}
}
