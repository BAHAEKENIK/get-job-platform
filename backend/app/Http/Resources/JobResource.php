<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
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
        'title' => $this->title,
        'description' => $this->description,
        'location' => $this->location,
        'contract_type' => $this->contract_type,
        'salary_amount' => $this->salary_amount,
        'salary_currency' => $this->salary_currency,
        'posted_at' => $this->created_at->format('Y-m-d H:i:s'),
        'recruiter' => [
            'id' => $this->user->id,
            'name' => $this->user->name,
        ],
    ];
}
}
