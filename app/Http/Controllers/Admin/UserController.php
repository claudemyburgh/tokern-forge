<?php

namespace App\Http\Controllers\Admin;

use App\Actions\User\CreateUser;
use App\Actions\User\DeleteUsers;
use App\Actions\User\ForceDeleteUsers;
use App\Actions\User\ListUsers;
use App\Actions\User\RestoreUsers;
use App\Actions\User\UpdateUser;
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
        $this->authorize('viewAny', User::class);

        $filters = [
            'filter' => $request->query('filter', 'withoutTrash'),
            'perPage' => $request->query('perPage', 10),
            'page' => $request->query('page', 1),
            'search' => $request->query('search', ''),
        ];

        $users = (new ListUsers)->handle($filters);

        return inertia('admin/users/index', [
            'users' => new UserCollection($users),
            'filter' => $filters['filter'],
            'perPage' => $filters['perPage'],
            'search' => $filters['search'],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $this->authorize('create', User::class);

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
        $this->authorize('create', User::class);

        $validated = $request->validated();

        (new CreateUser)->handle($validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $this->authorize('view', $user);

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
        $this->authorize('update', $user);

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
        $this->authorize('update', $user);

        $validated = $request->validated();

        (new UpdateUser)->handle($user, $validated);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user(s) from storage.
     */
    public function destroy($ids, Request $request)
    {
        // Handle bulk deletion with the exact pattern specified
        if ($request->has('ids')) {
            $ids = $request->input('ids');
        }

        $this->authorize('deleteAny', User::class);

        $result = (new DeleteUsers)->handle($ids, Auth::id());

        return redirect()->route('admin.users.index')
            ->with($result['success'] ? 'success' : 'error', $result['message']);
    }

    /**
     * Restore a single user from storage.
     */
    public function restoreSingle($user)
    {
        $this->authorize('restoreAny', User::class);

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
        $this->authorize('forceDeleteAny', User::class);

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
        // Handle bulk restoration with the exact pattern specified
        if ($request->has('ids')) {
            $ids = $request->input('ids');
        }

        $this->authorize('restoreAny', User::class);

        $result = (new RestoreUsers)->handle($ids);

        return redirect()->route('admin.users.index')
            ->with($result['success'] ? 'success' : 'error', $result['message']);
    }

    /**
     * Force delete the specified user(s) from storage.
     */
    public function forceDelete(Request $request, $ids = null)
    {
        // Handle bulk force deletion with the exact pattern specified
        if ($request->has('ids')) {
            $ids = $request->input('ids');
        }

        $this->authorize('forceDeleteAny', User::class);

        $result = (new ForceDeleteUsers)->handle($ids, Auth::id());

        return redirect()->route('admin.users.index')
            ->with($result['success'] ? 'success' : 'error', $result['message']);
    }
}
