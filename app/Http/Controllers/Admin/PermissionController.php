<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Permission\CreatePermission;
use App\Actions\Permission\DeletePermissions;
use App\Actions\Permission\ListPermissions;
use App\Actions\Permission\UpdatePermission;
use App\Http\Requests\Admin\StorePermissionRequest;
use App\Http\Requests\Admin\UpdatePermissionRequest;
use App\Http\Resources\Permissions\PermissionCollection;
use App\Http\Resources\Permissions\PermissionResource;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends BaseController
{
    /**
     * Display a listing of permissions.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Permission::class);

        $filters = [
            'filter' => $request->query('filter', 'all'),
            'perPage' => $request->query('perPage', 10),
            'page' => $request->query('page', 1),
            'search' => $request->query('search', ''),
        ];

        $permissions = (new ListPermissions)->handle($filters);

        return inertia('admin/permissions/index', [
            'permissions' => new PermissionCollection($permissions),
            'filter' => $filters['filter'],
            'perPage' => $filters['perPage'],
            'search' => $filters['search'],
        ]);
    }

    /**
     * Show the form for creating a new permission.
     */
    public function create()
    {
        $this->authorize('create', Permission::class);

        $roles = Role::all();

        return inertia('admin/permissions/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created permission in storage.
     */
    public function store(StorePermissionRequest $request)
    {
        $this->authorize('create', Permission::class);

        $validated = $request->validated();

        (new CreatePermission)->handle($validated);

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission(s) created successfully.');
    }

    /**
     * Display the specified permission.
     */
    public function show(Permission $permission)
    {
        $this->authorize('view', $permission);

        $permission->load('roles');

        return inertia('admin/permissions/show', [
            'permission' => new PermissionResource($permission),
        ]);
    }

    /**
     * Show the form for editing the specified permission.
     */
    public function edit(Permission $permission)
    {
        $this->authorize('update', $permission);

        $permission->load('roles');
        $roles = Role::all();

        return inertia('admin/permissions/edit', [
            'permission' => $permission,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified permission in storage.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission)
    {
        $this->authorize('update', $permission);

        $validated = $request->validated();

        (new UpdatePermission)->handle($permission, $validated);

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified permission from storage.
     */
    public function destroy($ids, Request $request)
    {
        // Handle bulk deletion with the exact pattern specified
        if ($request->has('ids')) {
            $ids = $request->input('ids');
        }

        $this->authorize('deleteAny', Permission::class);

        $result = (new DeletePermissions)->handle($ids);

        return redirect()->route('admin.permissions.index')
            ->with($result['success'] ? 'success' : 'error', $result['message']);
    }
}
