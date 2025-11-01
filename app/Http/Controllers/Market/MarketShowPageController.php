<?php

namespace App\Http\Controllers\Market;

use App\Http\Controllers\Controller;
use App\Models\Token;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;

class MarketShowPageController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return ['auth', 'verified'];
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Token $token)
    {
        return Inertia::render('market/show');
    }
}
