<?php

namespace App\Http\Controllers\Tools;

use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;

class ToolsIndexPageController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return ['auth', 'verified'];
    }

    public function __invoke()
    {
        return Inertia::render('tools/index');
    }
}
