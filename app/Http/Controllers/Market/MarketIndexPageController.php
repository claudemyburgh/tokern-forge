<?php

namespace App\Http\Controllers\Market;

use App\Http\Controllers\Controller;
use App\Models\Token;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketIndexPageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Token $tokens)
    {
        return Inertia::render('market/index');
    }
}
