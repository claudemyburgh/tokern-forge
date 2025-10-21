<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\BaseController;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Http\Resources\Users\UserCollection;
use App\Http\Resources\Users\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class UserController extends BaseController
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $this->authorize('manage users');

        $filter = $request->query('filter', 'withoutTrash');
        $perPage = $request->query('perPage', 10);
        $page = $request->query('page', 1);
        $search = $request->query('search', '');

        // Validate perPage value
        $validPerPage = in_array($perPage, [10, 20, 30, 40, 50]) ? $perPage : 10;

        // Validate and cast page to integer
        $validPage = is_numeric($page) ? (int) $page : 1;
        if ($validPage < 1) {
            $validPage = 1;
        }

        $query = User::with('roles');

        // Apply search filter
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        switch ($filter) {
            case 'onlyTrash':
                $query->onlyTrashed();
                break;
            case 'withTrash':
                $query->withTrashed();
                break;
            case 'all':
                $query->withTrashed(); // Explicitly include trashed records
                break;
            case 'withoutTrash':
            default:
                // Default behavior - only active records
                break;
        }

        $users = $query->latest()->paginate($validPerPage, ['*'], 'page', $validPage);

        return inertia('admin/users/index', [
            'users' => new UserCollection($users),
            'filter' => $filter,
            'perPage' => $validPerPage,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $this->authorize('manage users');

        $roles = Role::all();

        return inertia('admin/users/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $this->authorize('manage users');

        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $this->authorize('manage users');

        $user->load('roles', 'permissions');

        return inertia('admin/users/show', [
            'user' => UserResource::make($user),
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $this->authorize('manage users');

        $user->load('roles');
        $roles = Role::all();

        return inertia('admin/users/edit', [
            'user' => UserResource::make($user),
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $this->authorize('manage users');

        $validated = $request->validated();

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => isset($validated['password']) ? bcrypt($validated['password']) : $user->password,
        ]);

        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user(s) from storage.
     */
    public function destroy($ids = null, Request $request)
    {
        $this->authorize('manage users');

        // Handle bulk deletion with the exact pattern specified
        if ($request->has('ids')) {
            $ids = $request->input('ids');
        } elseif ($ids && is_string($ids)) {
            $ids = explode(',', $ids);
        } else {
            $ids = [$ids];
        }

        // Filter out null values
        $ids = array_filter($ids);

        if (empty($ids)) {
            return redirect()->route('admin.users.index')
                ->with('error', 'No users selected for deletion.');
        }

        // Prevent users from deleting themselves
        $usersToDelete = \App\Models\User::whereIn('id', $ids)->get();
        $deletableUsers = [];
        $protectedUsers = [];

        foreach ($usersToDelete as $user) {
            if ($user->id === \Illuminate\Support\Facades\Auth::id()) {
                $protectedUsers[] = $user->name;
            } else {
                $deletableUsers[] = $user->id;
            }
        }

        if (!empty($deletableUsers)) {
            \App\Models\User::whereIn('id', $deletableUsers)->delete();
        }

        if (!empty($protectedUsers)) {
            if (count($protectedUsers) == 1) {
                return redirect()->route('admin.users.index')
                    ->with('error', 'You cannot delete yourself.');
            } else {
                return redirect()->route('admin.users.index')
                    ->with('error', 'Cannot delete protected users: ' . implode(', ', $protectedUsers) . '.');
            }
        }

        if (count($deletableUsers) == 1) {
            return redirect()->route('admin.users.index')
                ->with('success', 'User deleted successfully.');
        } else {
            return redirect()->route('admin.users.index')
                ->with('success', count($deletableUsers) . ' users deleted successfully.');
        }
    }

    /**
     * Restore a single user from storage.
     */
    public function restoreSingle($user)
    {
        $this->authorize('manage users');

        // Explicitly find the user including trashed models
        $user = User::withTrashed()->findOrFail($user);

        if ($user->trashed()) {
            $user->restore();
            return redirect()->back()->with('success', 'User restored successfully.');
        }

        return redirect()->back()->with('error', 'User is not deleted.');
    }

    /**
     * Force delete a single user from storage.
     */
    public function forceDeleteSingle($user)
    {
        $this->authorize('manage users');

        // Explicitly find the user including trashed models
        $user = User::withTrashed()->findOrFail($user);

        // Prevent users from force deleting themselves
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot force delete yourself.');
        }

        if ($user->trashed()) {
            $user->forceDelete();
            return redirect()->back()->with('success', 'User force deleted successfully.');
        }

        return redirect()->back()->with('error', 'User is not deleted.');
    }

    /**
     * Restore the specified user(s) from storage.
     */
    public function restore(Request $request, $ids = null)
    {
        $this->authorize('manage users');

        // Handle bulk restoration with the exact pattern specified
        if ($request->has('ids')) {
            $ids = $request->input('ids');
        } elseif ($ids && is_string($ids)) {
            $ids = explode(',', $ids);
        } else {
            $ids = [$ids];
        }

        // Filter out null values
        $ids = array_filter($ids);

        if (empty($ids)) {
            return redirect()->route('admin.users.index')
                ->with('error', 'No users selected for restoration.');
        }

        $usersToRestore = User::withTrashed()->whereIn('id', $ids)->get();
        $restoredUsers = [];

        foreach ($usersToRestore as $user) {
            if ($user->trashed()) {
                $user->restore();
                $restoredUsers[] = $user->id;
            }
        }

        if (count($restoredUsers) == 1) {
            return redirect()->route('admin.users.index')
                ->with('success', 'User restored successfully.');
        } else {
            return redirect()->route('admin.users.index')
                ->with('success', count($restoredUsers) . ' users restored successfully.');
        }
    }

    /**
     * Force delete the specified user(s) from storage.
     */
    public function forceDelete(Request $request, $ids = null)
    {
        $this->authorize('manage users');

        // Handle bulk force deletion with the exact pattern specified
        if ($request->has('ids')) {
            $ids = $request->input('ids');
        } elseif ($ids && is_string($ids)) {
            $ids = explode(',', $ids);
        } else {
            $ids = [$ids];
        }

        // Filter out null values
        $ids = array_filter($ids);

        // Prevent users from force deleting themselves
        $ids = array_filter($ids, function ($id) {
            return $id != Auth::id();
        });

        if (empty($ids)) {
            return redirect()->route('admin.users.index')
                ->with('error', 'No users selected for force deletion or you tried to delete yourself.');
        }

        $usersToForceDelete = User::withTrashed()->whereIn('id', $ids)->get();
        $forceDeletedUsers = [];

        foreach ($usersToForceDelete as $user) {
            if ($user->trashed()) {
                $user->forceDelete();
                $forceDeletedUsers[] = $user->id;
            }
        }

        if (count($forceDeletedUsers) == 1) {
            return redirect()->route('admin.users.index')
                ->with('success', 'User force deleted successfully.');
        } else {
            return redirect()->route('admin.users.index')
                ->with('success', count($forceDeletedUsers) . ' users force deleted successfully.');
        }
    }
}
