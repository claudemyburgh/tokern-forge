<?php

namespace App\Http\Controllers\Market;

use App\Http\Controllers\Controller;
use App\Models\Token;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MarketShowPageController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Token $token)
    {
        return Inertia::render('market/show');
    }
}
