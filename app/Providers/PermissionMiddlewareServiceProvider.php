<?php

namespace App\Providers;

use App\Http\Middleware\CheckPermission;
use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;

class PermissionMiddlewareServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(Router $router): void
    {
        $router->aliasMiddleware('permission', CheckPermission::class);
    }
}