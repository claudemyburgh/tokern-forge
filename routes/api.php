<?php

use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();

})->middleware('auth:sanctum');

Route::group([
    'middleware' => 'auth:sanctum',
], function () {
    Route::apiResource('/users', UserController::class);
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    // Additional user routes
    Route::get('users/stats', [UserController::class, 'stats'])->name('users.stats');
    Route::get('users/export', [UserController::class, 'export'])->name('users.export');
});
