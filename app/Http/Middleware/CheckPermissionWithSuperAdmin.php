<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermissionWithSuperAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        // Super admin bypasses all permission checks
        if (auth()->check() && auth()->user()->isSuperAdmin()) {
            return $next($request);
        }

        // Regular permission check
        if (!auth()->user()?->can($permission)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
