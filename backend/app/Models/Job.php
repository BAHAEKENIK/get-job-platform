<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Job extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable
     *
     * @var array<int, string>
     */
    protected $fillable=[
        'user_id',
        'title',
        'description',
        'location',
        'contract_type',
        'salary_amount',
        'salary_currency'
    ];
    /**
     * Get the user (recruiter) that owns the job.
     *
     */
    public function user():BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
