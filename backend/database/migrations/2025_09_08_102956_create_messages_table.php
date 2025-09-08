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
    Schema::create('messages', function (Blueprint $table) {
        $table->id();

        // Liens
        $table->foreignId('conversation_id')->constrained('conversations')->onDelete('cascade');
        $table->foreignId('user_id')->comment('The sender')->constrained('users')->onDelete('cascade');

        // Contenu du message
        $table->text('content')->nullable(); // Nullable car un message peut être juste un fichier
        $table->string('file_path')->nullable(); // Optionnel

        // Pour la fonctionnalité "Vu" / "Lu"
        $table->timestamp('read_at')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
