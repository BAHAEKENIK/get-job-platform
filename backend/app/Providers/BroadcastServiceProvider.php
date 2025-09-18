<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // On commente ou supprime cette ligne
        // Broadcast::routes(['middleware' => ['api', 'auth:sanctum']]);

        // On la remplace par la version par défaut
        Broadcast::routes();

        require base_path('routes/channels.php');
    }
}
