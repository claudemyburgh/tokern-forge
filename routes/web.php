<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
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

// Admin routes - only accessible to users with appropriate permissions
Route::middleware(['auth', 'verified', 'permission:manage users'])->as('admin.')->group(function () {
    Route::resource('admin/users', UserController::class);
    Route::post('admin/users/{user}/restore', [UserController::class, 'restoreSingle'])->name('admin.users.restore');
    Route::delete('admin/users/{user}/force-delete', [UserController::class, 'forceDeleteSingle'])->name('admin.users.force-delete');
    Route::delete('admin/users/bulk', [UserController::class, 'destroy'])->name('admin.users.bulk.destroy');
    Route::post('admin/users/bulk/restore', [UserController::class, 'restore'])->name('admin.users.bulk.restore');
    Route::delete('admin/users/bulk/force-delete', [UserController::class, 'forceDelete'])->name('admin.users.bulk.force-delete');
});

Route::middleware(['auth', 'verified', 'permission:manage roles'])->as('admin.')->group(function () {
    Route::resource('admin/roles', RoleController::class);
    Route::delete('admin/roles/bulk', [RoleController::class, 'destroy'])->name('admin.roles.bulk.destroy');
});

Route::middleware(['auth', 'verified', 'permission:manage permissions'])->as('admin.')->group(function () {
    Route::resource('admin/permissions', PermissionController::class);
    Route::delete('admin/permissions/bulk', [PermissionController::class, 'destroy'])->name('admin.permissions.bulk.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';