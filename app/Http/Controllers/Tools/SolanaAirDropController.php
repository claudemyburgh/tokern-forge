<?php

namespace App\Http\Controllers\Tools;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class SolanaAirDropController extends Controller
{
    public function index()
    {
        return Inertia::render('tools/solana-air-drop');
    }
}
