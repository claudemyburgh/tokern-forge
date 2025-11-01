<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardIndexController;
use App\Http\Controllers\Market\MarketIndexPageController;
use App\Http\Controllers\Market\MarketShowPageController;
use App\Http\Controllers\Token\TokenCreateController;
use App\Http\Controllers\Token\TokenIndexController;
use App\Http\Controllers\Token\TokenStoreController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardIndexController::class)->name('dashboard');

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

// Admin routes - only accessible to users with appropriate permissions
Route::middleware(['auth', 'verified', 'permission:manage users'])->group(function () {
    Route::resource('admin/users', UserController::class)->names([
        'index' => 'admin.users.index',
        'create' => 'admin.users.create',
        'store' => 'admin.users.store',
        'show' => 'admin.users.show',
        'edit' => 'admin.users.edit',
        'update' => 'admin.users.update',
        'destroy' => 'admin.users.destroy',
    ]);

    // Custom routes with explicit parameter binding to include trashed models
    Route::post('admin/users/{user}/restore', [UserController::class, 'restoreSingle'])->name('admin.users.restore')
        ->where('user', '[0-9]+');
    Route::delete('admin/users/{user}/force-delete', [UserController::class, 'forceDeleteSingle'])->name('admin.users.force-delete')
        ->where('user', '[0-9]+');

    // Bulk operations
    Route::delete('admin/users/bulk', [UserController::class, 'destroy'])->name('admin.users.bulk.destroy');
    Route::post('admin/users/bulk/restore', [UserController::class, 'restore'])->name('admin.users.bulk.restore');
    Route::delete('admin/users/bulk/force-delete', [UserController::class, 'forceDelete'])->name('admin.users.bulk.force-delete');


});


Route::middleware(['auth', 'verified', 'permission:manage roles'])->group(function () {
    Route::resource('admin/roles', RoleController::class)->names([
        'index' => 'admin.roles.index',
        'create' => 'admin.roles.create',
        'store' => 'admin.roles.store',
        'show' => 'admin.roles.show',
        'edit' => 'admin.roles.edit',
        'update' => 'admin.roles.update',
        'destroy' => 'admin.roles.destroy',
    ]);
    Route::delete('admin/roles/bulk', [RoleController::class, 'destroy'])->name('admin.roles.bulk.destroy');

    Route::get('market-place', MarketIndexPageController::class)->name('market.index');
    Route::get('market-place/{token}', MarketShowPageController::class)->name('market.show');
});

Route::middleware(['auth', 'verified', 'permission:manage permissions'])->group(function () {
    Route::resource('admin/permissions', PermissionController::class)->names([
        'index' => 'admin.permissions.index',
        'create' => 'admin.permissions.create',
        'store' => 'admin.permissions.store',
        'show' => 'admin.permissions.show',
        'edit' => 'admin.permissions.edit',
        'update' => 'admin.permissions.update',
        'destroy' => 'admin.permissions.destroy',
    ]);
    Route::delete('admin/permissions/bulk', [PermissionController::class, 'destroy'])->name('admin.permissions.bulk.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
