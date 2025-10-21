<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        // Check if user is authenticated
        if (! Auth::check()) {
            // For Inertia requests, we'll handle this differently
            if ($request->header('X-Inertia')) {
                return redirect()->route('login');
            }

            abort(401);
        }

        // Check if user has any of the required permissions
        if (! empty($permissions) && ! $request->user()->hasAnyPermission($permissions)) {
            // For Inertia requests, we'll handle this differently
            if ($request->header('X-Inertia')) {
                return redirect()->route('dashboard');
            }

            abort(403);
        }

        return $next($request);
    }
}
