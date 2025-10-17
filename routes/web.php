<?php

use App\Http\Controllers\Token\TokenCreateController;
use App\Http\Controllers\Token\TokenIndexController;
use App\Http\Controllers\Token\TokenStoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('profile', function () {
        return Inertia::render('profile');
    })->name('profile');
});

// Example route using our permission middleware
Route::middleware(['auth', 'verified', 'permission:view tokens'])->group(function () {
    Route::get('tokens', TokenIndexController::class)->name('tokens.index');
});

Route::middleware(['auth', 'verified', 'permission:create tokens'])->group(function () {
    Route::get('tokens/create', TokenCreateController::class)->name('tokens.create');
    Route::post('tokens', TokenStoreController::class)->name('tokens.store');
});

// Example of using middleware with multiple permissions
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('admin', function () {
        return Inertia::render('profile'); // Just for demonstration
    })->name('admin');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
