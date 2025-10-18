<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\BaseController;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends BaseController
{
    /**
     * Display a listing of roles.
     */
    public function index()
    {
        $this->authorize('manage roles');

        $roles = Role::with('permissions')->latest()->paginate(15);

        return inertia('admin/roles/index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        $this->authorize('manage roles');

        $permissions = Permission::all();

        return inertia('admin/roles/create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('manage roles');

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'permissions' => 'array|exists:permissions,name',
        ]);

        $role = Role::create(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $role->givePermissionTo($validated['permissions']);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role)
    {
        $this->authorize('manage roles');

        $role->load('permissions', 'users');

        return inertia('admin/roles/show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        $this->authorize('manage roles');

        $role->load('permissions');
        $permissions = Permission::all();

        return inertia('admin/roles/edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(Request $request, Role $role)
    {
        $this->authorize('manage roles');

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array|exists:permissions,name',
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        } else {
            $role->syncPermissions([]);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified role(s) from storage.
     */
    public function destroy($ids = null, Request $request)
    {
        $this->authorize('manage roles');

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
            return redirect()->route('admin.roles.index')
                ->with('error', 'No roles selected for deletion.');
        }
        
        // Prevent deletion of super-admin role
        $rolesToDelete = \Spatie\Permission\Models\Role::whereIn('id', $ids)->get();
        $deletableRoles = [];
        $protectedRoles = [];
        
        foreach ($rolesToDelete as $role) {
            if ($role->name === 'super-admin') {
                $protectedRoles[] = $role->name;
            } else {
                $deletableRoles[] = $role->id;
            }
        }
        
        if (!empty($deletableRoles)) {
            \Spatie\Permission\Models\Role::whereIn('id', $deletableRoles)->delete();
        }
        
        if (!empty($protectedRoles)) {
            if (count($protectedRoles) == 1) {
                return redirect()->route('admin.roles.index')
                    ->with('error', 'The super-admin role cannot be deleted.');
            } else {
                return redirect()->route('admin.roles.index')
                    ->with('error', 'Protected roles cannot be deleted: ' . implode(', ', $protectedRoles) . '.');
            }
        }
        
        if (count($deletableRoles) == 1) {
            return redirect()->route('admin.roles.index')
                ->with('success', 'Role deleted successfully.');
        } else {
            return redirect()->route('admin.roles.index')
                ->with('success', count($deletableRoles) . ' roles deleted successfully.');
        }
    }
}