<?php

use App\Http\Controllers\Token\TokenCreateController;
use App\Http\Controllers\Token\TokenIndexController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::get('tokens', TokenIndexController::class)->name('tokens.index');
Route::get('tokens/create', TokenCreateController::class)->name('tokens.create');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
