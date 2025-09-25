<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    /**
     * The proxies that should be trusted.
     *
     * @var array<int, string>|string|null
     */

    // --- LA MODIFICATION EST ICI ---
    // On remplace le contenu de $proxies pour faire confiance à tous les proxies.
    // C'est la configuration recommandée pour les plateformes comme Railway.
    protected $proxies = '*';

    /**
     * The headers that should be trusted.
     *
     * @var int
     */
    protected $headers =
        Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB;
}
