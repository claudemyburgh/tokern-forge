<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardIndexController;
use App\Http\Controllers\Market\MarketIndexPageController;
use App\Http\Controllers\Market\MarketShowPageController;
use App\Http\Controllers\ProfilePageController;
use App\Http\Controllers\Token\TokenCreateController;
use App\Http\Controllers\Token\TokenIndexController;
use App\Http\Controllers\Token\TokenStoreController;
use App\Http\Controllers\Tools\SolanaAirDropController;
use App\Http\Controllers\Tools\ToolsIndexPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Authenticated user routes
Route::get('dashboard', DashboardIndexController::class)->name('dashboard');
Route::get('profile', ProfilePageController::class)->name('profile');

// Token management routes
Route::get('tokens', TokenIndexController::class)->name('tokens.index');
Route::get('tokens/create', TokenCreateController::class)->name('tokens.create');
Route::post('tokens', TokenStoreController::class)->name('tokens.store');

// Tools routes
Route::get('tools', ToolsIndexPageController::class)->name('tools.index');
Route::get('tools/solana-air-drop', [SolanaAirDropController::class, 'index'])->name('tools.solana-air-drop');

// Market routes
Route::get('market-place', MarketIndexPageController::class)->name('market.index');
Route::get('market-place/{token}', MarketShowPageController::class)->name('market.show');



// Admin routes - only accessible to users with appropriate permissions
Route::prefix('admin')->name('admin.')->group(function () {
    // User management routes
    Route::middleware(['auth', 'verified', 'permission:manage users'])->group(function () {
        Route::resource('users', UserController::class);

        // Custom routes with explicit parameter binding to include trashed models
        Route::post('users/{user}/restore', [UserController::class, 'restoreSingle'])->name('users.restore')
            ->where('user', '[0-9]+');
        Route::delete('users/{user}/force-delete', [UserController::class, 'forceDeleteSingle'])->name('users.force-delete')
            ->where('user', '[0-9]+');

        // Bulk operations
        Route::delete('users/bulk', [UserController::class, 'destroy'])->name('users.bulk.destroy');
        Route::post('users/bulk/restore', [UserController::class, 'restore'])->name('users.bulk.restore');
        Route::delete('users/bulk/force-delete', [UserController::class, 'forceDelete'])->name('users.bulk.force-delete');
    });

    // Role management routes
    Route::middleware(['auth', 'verified', 'permission:manage roles'])->group(function () {
        Route::resource('roles', RoleController::class);
        Route::delete('roles/bulk', [RoleController::class, 'destroy'])->name('roles.bulk.destroy');
    });

    // Permission management routes
    Route::middleware(['auth', 'verified', 'permission:manage permissions'])->group(function () {
        Route::resource('permissions', PermissionController::class);
        Route::delete('permissions/bulk', [PermissionController::class, 'destroy'])->name('permissions.bulk.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
