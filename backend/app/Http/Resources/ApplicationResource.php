<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
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
            'status' => $this->status,
            'applied_at' => $this->created_at->format('Y-m-d H:i:s'),
            'cv_url' => asset('storage/' . $this->cv_path), // Crée l'URL complète du CV
            'candidate' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'job' => [
                'id' => $this->job->id,
                'title' => $this->job->title,
            ],
    ];
}
}
