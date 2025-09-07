<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('applications', function (Blueprint $table) {
        $table->id();

        // Clés étrangères et relations
        $table->foreignId('user_id')->comment('The candidate')->constrained('users')->onDelete('cascade');
        $table->foreignId('job_id')->constrained('jobs')->onDelete('cascade');

        $table->string('cv_path'); // Chemin de stockage du fichier CV
        $table->enum('status', ['pending', 'viewed', 'rejected', 'accepted'])->default('pending');

        $table->timestamps();

        // Ajout d'une contrainte d'unicité pour empêcher un utilisateur
        // de postuler plusieurs fois à la même offre.
        $table->unique(['user_id', 'job_id']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
