<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL; // <-- 1. Importer la façade URL

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // --- 2. LA MODIFICATION EST ICI ---
        // On vérifie si l'environnement de l'application est 'production'.
        // La variable APP_ENV dans notre .env sur Railway sera mise à 'production'.
        if ($this->app->environment('production')) {
            // On force tous les liens générés à utiliser le protocole HTTPS.
            URL::forceScheme('https');
        }
    }
}
