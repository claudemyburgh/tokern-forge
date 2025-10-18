<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\BaseController;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends BaseController
{
    /**
     * Display a listing of permissions.
     */
    public function index()
    {
        $this->authorize('manage permissions');
        
        $permissions = Permission::with('roles')->latest()->paginate(15);
        
        return inertia('admin/permissions/index', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new permission.
     */
    public function create()
    {
        $this->authorize('manage permissions');
        
        $roles = Role::all();
        
        return inertia('admin/permissions/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created permission in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('manage permissions');
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions',
            'roles' => 'array|exists:roles,name',
        ]);

        $permission = Permission::create(['name' => $validated['name']]);

        if (isset($validated['roles'])) {
            $permission->assignRole($validated['roles']);
        }

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission created successfully.');
    }

    /**
     * Display the specified permission.
     */
    public function show(Permission $permission)
    {
        $this->authorize('manage permissions');
        
        $permission->load('roles');
        
        return inertia('admin/permissions/show', [
            'permission' => $permission,
        ]);
    }

    /**
     * Show the form for editing the specified permission.
     */
    public function edit(Permission $permission)
    {
        $this->authorize('manage permissions');
        
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
    public function update(Request $request, Permission $permission)
    {
        $this->authorize('manage permissions');
        
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
            'roles' => 'array|exists:roles,name',
        ]);

        $permission->update(['name' => $validated['name']]);

        if (isset($validated['roles'])) {
            $permission->syncRoles($validated['roles']);
        } else {
            $permission->syncRoles([]);
        }

        return redirect()->route('admin.permissions.index')
            ->with('success', 'Permission updated successfully.');
    }

    /**
     * Remove the specified permission from storage.
     */
    public function destroy($ids = null, Request $request)
    {
        $this->authorize('manage permissions');
        
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
            return redirect()->route('admin.permissions.index')
                ->with('error', 'No permissions selected for deletion.');
        }
        
        // Prevent deletion of core permissions
        $corePermissions = ['view tokens', 'create tokens', 'edit tokens', 'delete tokens', 'manage users', 'manage roles', 'manage permissions', 'manage settings'];
        
        $permissionsToDelete = \Spatie\Permission\Models\Permission::whereIn('id', $ids)->get();
        $deletablePermissions = [];
        $protectedPermissions = [];
        
        foreach ($permissionsToDelete as $permission) {
            if (in_array($permission->name, $corePermissions)) {
                $protectedPermissions[] = $permission->name;
            } else {
                $deletablePermissions[] = $permission->id;
            }
        }
        
        if (!empty($deletablePermissions)) {
            \Spatie\Permission\Models\Permission::whereIn('id', $deletablePermissions)->delete();
        }
        
        if (!empty($protectedPermissions)) {
            if (count($protectedPermissions) == 1) {
                return redirect()->route('admin.permissions.index')
                    ->with('error', 'Core permission "' . $protectedPermissions[0] . '" cannot be deleted.');
            } else {
                return redirect()->route('admin.permissions.index')
                    ->with('error', 'Core permissions cannot be deleted: ' . implode(', ', $protectedPermissions) . '.');
            }
        }
        
        if (count($deletablePermissions) == 1) {
            return redirect()->route('admin.permissions.index')
                ->with('success', 'Permission deleted successfully.');
        } else {
            return redirect()->route('admin.permissions.index')
                ->with('success', count($deletablePermissions) . ' permissions deleted successfully.');
        }
    }
}