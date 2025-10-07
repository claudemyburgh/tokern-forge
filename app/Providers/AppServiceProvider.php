<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        // Define Super Admin gate that bypasses all permission checks
        Gate::before(function ($user, $ability) {
            if ($user->hasRole('super admin')) {
                return true;
            }
        });

        Str::macro('getInitials', function (string $fullName): string {
            $names = preg_split('/\s+/', trim($fullName));

            if (empty($names) || $names[0] === '') {
                return '';
            }

            if (count($names) === 1) {
                return strtoupper(substr($names[0], 0, 1));
            }

            $firstInitial = substr($names[0], 0, 1);
            $lastInitial = substr(end($names), 0, 1);

            return strtoupper($firstInitial.$lastInitial);
        });

    }
}
