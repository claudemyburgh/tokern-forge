<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\BaseController;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use App\Http\Resources\Roles\RoleCollection;
use App\Http\Resources\Roles\RoleResource;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends BaseController
{
    /**
     * Display a listing of roles.
     */
    public function index(Request $request)
    {
        $this->authorize('manage roles');

        $filter = $request->query('filter', 'all');
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

        // Get all roles and group them by name
        $query = Role::with('permissions');
        
        // Apply search filter
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $allRoles = $query->get();
        
        // Group roles by name
        $groupedRoles = $allRoles->groupBy('name');
        
        // Create a collection of merged roles for display
        $mergedRoles = [];
        foreach ($groupedRoles as $name => $roles) {
            // Take the first role as the base
            $baseRole = $roles->first();
            
            // Create a merged representation
            $mergedRole = [
                'id' => $baseRole->id,
                'name' => $name,
                'guards' => $roles->pluck('guard_name')->toArray(),
                'permissions' => $roles->flatMap->permissions->unique('id')->values()->all(),
                'created_at' => $baseRole->created_at,
                'updated_at' => $baseRole->updated_at,
            ];
            
            $mergedRoles[] = $mergedRole;
        }
        
        // Convert to a paginated collection for the view
        $currentPage = $validPage;
        $perPageValue = $validPerPage;
        $offset = ($currentPage - 1) * $perPageValue;
        $paginatedRoles = array_slice($mergedRoles, $offset, $perPageValue);
        
        $roles = new \Illuminate\Pagination\LengthAwarePaginator(
            $paginatedRoles,
            count($mergedRoles),
            $perPageValue,
            $currentPage,
            [
                'path' => $request->url(),
                'pageName' => 'page',
            ]
        );

        return inertia('admin/roles/index', [
            'roles' => [
                'data' => $paginatedRoles,
                'links' => [],
                'meta' => [
                    'current_page' => $currentPage,
                    'last_page' => $roles->lastPage(),
                    'from' => $offset + 1,
                    'to' => $offset + count($paginatedRoles),
                    'total' => count($mergedRoles),
                    'per_page' => $perPageValue,
                ],
            ],
            'filter' => $filter,
            'perPage' => $validPerPage,
            'search' => $search,
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        $this->authorize('manage roles');

        // Get all permissions grouped by guard
        $permissions = Permission::all();
        $groupedPermissions = $permissions->groupBy('guard_name');

        return inertia('admin/roles/create', [
            'permissions' => $groupedPermissions,
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        $this->authorize('manage roles');

        $validated = $request->validated();

        $role = Role::create(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            // Handle permissions with guards
            $permissionIds = [];
            foreach ($validated['permissions'] as $guard => $perms) {
                if (is_array($perms)) {
                    foreach ($perms as $permissionName) {
                        // Find the permission with the specific guard
                        $permission = Permission::where('name', $permissionName)
                            ->where('guard_name', $guard)
                            ->first();
                        if ($permission) {
                            $permissionIds[] = $permission->id;
                        }
                        // If permission not found, we silently skip it to prevent errors
                    }
                }
            }
            // Only sync if we have valid permission IDs
            if (!empty($permissionIds)) {
                $role->syncPermissions($permissionIds);
            }
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

        // Get all roles with the same name (across different guards)
        $allRoles = Role::where('name', $role->name)->with('permissions')->get();
        
        // Merge permissions from all guards
        $allPermissions = $allRoles->flatMap->permissions->unique('id')->values()->all();
        
        // Prepare data for the view
        $mergedRole = [
            'id' => $role->id,
            'name' => $role->name,
            'guards' => $allRoles->pluck('guard_name')->toArray(),
            'permissions' => $allPermissions,
            'created_at' => $role->created_at,
            'updated_at' => $role->updated_at,
        ];

        return inertia('admin/roles/show', [
            'role' => $mergedRole,
        ]);
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        $this->authorize('manage roles');

        // Get all roles with the same name (across different guards)
        $allRoles = Role::where('name', $role->name)->with('permissions')->get();
        
        // Get all permissions grouped by guard
        $permissions = Permission::all();
        $groupedPermissions = $permissions->groupBy('guard_name');

        return inertia('admin/roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'guards' => $allRoles->pluck('guard_name')->toArray(),
                'permissions' => $allRoles->flatMap->permissions->groupBy('guard_name')->map(function ($guardPermissions) {
                    return $guardPermissions->pluck('name');
                })->toArray(),
            ],
            'permissions' => $groupedPermissions,
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->authorize('manage roles');

        $validated = $request->validated();

        // Get all roles with the same name (across different guards)
        $allRoles = Role::where('name', $role->name)->get();

        // Update the name for all roles with the same name
        if (isset($validated['name'])) {
            foreach ($allRoles as $r) {
                $r->update(['name' => $validated['name']]);
            }
            // Update the main role reference
            $role->refresh();
        }

        // Handle permissions for each guard
        if (isset($validated['permissions'])) {
            foreach ($allRoles as $r) {
                $guard = $r->guard_name;
                $permissionIds = [];
                
                // Get permissions for this specific guard
                if (isset($validated['permissions'][$guard]) && is_array($validated['permissions'][$guard])) {
                    foreach ($validated['permissions'][$guard] as $permissionName) {
                        // Find the permission with the specific guard
                        $permission = Permission::where('name', $permissionName)
                            ->where('guard_name', $guard)
                            ->first();
                        if ($permission) {
                            $permissionIds[] = $permission->id;
                        }
                    }
                }
                
                // Sync permissions for this role
                $r->syncPermissions($permissionIds);
            }
        } else {
            // If no permissions provided, clear all permissions
            foreach ($allRoles as $r) {
                $r->syncPermissions([]);
            }
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully across all guards.');
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
