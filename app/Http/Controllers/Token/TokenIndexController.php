<?php

namespace App\Http\Controllers\Token;

use App\Actions\Token\ViewTokens;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;

class TokenIndexController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return ['auth', 'verified'];
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(ViewTokens $viewTokens)
    {
        return Inertia::render('token/index', [
            'tokens' => Inertia::scroll(fn () => $viewTokens->handle()),
        ]);
    }
}
