<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a paginated listing of users with filters and sorting.
     */
    public function index(Request $request): JsonResponse
    {
        // Validate request parameters
        $validated = $request->validate([
            'page' => 'sometimes|integer|min:1',
            'per_page' => 'sometimes|integer|min:5|max:100',
            'search' => 'sometimes|string|max:255',
            'sort_by' => 'sometimes|string|in:name,email,created_at,updated_at',
            'sort_order' => 'sometimes|string|in:asc,desc',
            'role' => 'sometimes|string',
            'verified' => 'sometimes|string|in:all,verified,unverified',
        ]);

        // Get parameters with defaults
        $perPage = $validated['per_page'] ?? 10;
        $search = $validated['search'] ?? '';
        $sortBy = $validated['sort_by'] ?? 'created_at';
        $sortOrder = $validated['sort_order'] ?? 'desc';
        $roleFilter = $validated['role'] ?? 'all';
        $verifiedFilter = $validated['verified'] ?? 'all';

        // Build query
        $query = User::query()
            ->with(['roles', 'media'])
            ->withTrashed(); // Include soft deleted if needed, remove if not

        // Apply search filter
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('bio', 'like', "%{$search}%");
            });
        }

        // Apply role filter
        if ($roleFilter !== 'all') {
            if ($roleFilter === 'super-admin') {
                $query->where('is_super_admin', true);
            } elseif ($roleFilter === 'user') {
                // Users with no roles and not super admin
                $query->where('is_super_admin', false)
                    ->whereDoesntHave('roles');
            } else {
                // Filter by specific role
                $query->whereHas('roles', function ($q) use ($roleFilter) {
                    $q->where('name', $roleFilter);
                });
            }
        }

        // Apply verification filter
        if ($verifiedFilter === 'verified') {
            $query->whereNotNull('email_verified_at');
        } elseif ($verifiedFilter === 'unverified') {
            $query->whereNull('email_verified_at');
        }

        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);

        // Paginate results
        $users = $query->paginate($perPage);

        // Transform the response to include computed attributes
        $users->getCollection()->transform(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'bio' => $user->bio,
                'email_verified_at' => $user->email_verified_at,
                'two_factor_secret' => $user->two_factor_secret,
                'two_factor_recovery_codes' => $user->two_factor_recovery_codes,
                'two_factor_confirmed_at' => $user->two_factor_confirmed_at,
                'deleted_at' => $user->deleted_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'avatar' => $user->avatar,
                'avatar_small' => $user->avatar_small,
                'initials' => $user->initials,
                'is_super_admin' => $user->is_super_admin,
                'media' => $user->media,
                'roles' => $user->roles,
            ];
        });

        return response()->json($users);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'roles' => 'sometimes|array',
            'roles.*' => 'sometimes|string|exists:roles,name',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return response()->json([
            'message' => 'User created successfully',
            'data' => $user->load(['roles', 'media']),
        ], 201);
    }

    /**
     * Display the specified user.
     */
    public function show(User $user): JsonResponse
    {
        $user->load(['roles', 'media']);

        return response()->json([
            'data' => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,'.$user->id,
            'bio' => 'nullable|string|max:1000',
            'roles' => 'sometimes|array',
            'roles.*' => 'sometimes|string|exists:roles,name',
        ]);

        $user->update($validated);

        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return response()->json([
            'message' => 'User updated successfully',
            'data' => $user->load(['roles', 'media']),
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }

    /**
     * Get statistics for the users.
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => User::count(),
            'verified' => User::whereNotNull('email_verified_at')->count(),
            'unverified' => User::whereNull('email_verified_at')->count(),
            'super_admins' => User::where('is_super_admin', true)->count(),
            'with_roles' => User::whereHas('roles')->count(),
            'without_roles' => User::where('is_super_admin', false)
                ->whereDoesntHave('roles')
                ->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Export users data.
     */
    public function export(Request $request): JsonResponse
    {
        $users = User::with(['roles', 'media'])->get();

        return response()->json([
            'data' => $users,
            'count' => $users->count(),
        ]);
    }
}
