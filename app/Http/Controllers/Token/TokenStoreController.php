<?php

namespace App\Http\Controllers\Token;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class TokenStoreController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return ['auth', 'verified', 'permission:create tokens'];
    }

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        //
    }
}
