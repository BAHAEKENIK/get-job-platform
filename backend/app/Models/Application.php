<?php

namespace App\Models;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    use HasFactory;
    protected $fillable=[
        'user_id',
        'job_id',
        'cv_path',
        'status',
    ];
    /**
     * Get the user (candidate) who submitted the applications.
     */
    public function user():BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the job to which the application was submitted.
     */
    public function job():BelongsTo
    {
        return $this->belongsTo(Job::class);
    }
}
