<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Permission\GetGroupedPermissions;
use App\Actions\Role\CreateRole;
use App\Actions\Role\DeleteRoles;
use App\Actions\Role\GetRoleDetails;
use App\Actions\Role\ListRoles;
use App\Actions\Role\UpdateRole;
use App\Http\Requests\Admin\StoreRoleRequest;
use App\Http\Requests\Admin\UpdateRoleRequest;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends BaseController
{
    /**
     * Display a listing of roles.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Role::class);

        $filters = [
            'filter' => $request->query('filter', 'all'),
            'perPage' => $request->query('perPage', 10),
            'page' => $request->query('page', 1),
            'search' => $request->query('search', ''),
        ];

        $roles = (new ListRoles)->handle($filters);

        return inertia('admin/roles/index', [
            'roles' => [
                'data' => $roles->items(),
                'links' => [],
                'meta' => [
                    'current_page' => $roles->currentPage(),
                    'last_page' => $roles->lastPage(),
                    'from' => $roles->firstItem(),
                    'to' => $roles->lastItem(),
                    'total' => $roles->total(),
                    'per_page' => $roles->perPage(),
                ],
            ],
            'filter' => $filters['filter'],
            'perPage' => $filters['perPage'],
            'search' => $filters['search'],
        ]);
    }

    /**
     * Show the form for creating a new role.
     */
    public function create()
    {
        $this->authorize('create', Role::class);

        $groupedPermissions = (new GetGroupedPermissions)->handle();

        return inertia('admin/roles/create', [
            'permissions' => $groupedPermissions,
        ]);
    }

    /**
     * Store a newly created role in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        $this->authorize('create', Role::class);

        $validated = $request->validated();

        (new CreateRole)->handle($validated);

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified role.
     */
    public function show(Role $role)
    {
        $this->authorize('view', $role);

        $roleDetails = (new GetRoleDetails)->handle($role);

        return inertia('admin/roles/show', [
            'role' => $roleDetails,
        ]);
    }

    /**
     * Show the form for editing the specified role.
     */
    public function edit(Role $role)
    {
        $this->authorize('update', $role);

        $roleDetails = (new GetRoleDetails)->handle($role);
        $groupedPermissions = (new GetGroupedPermissions)->handle();

        // Prepare role permissions grouped by guard for the form
        $rolePermissions = [];
        foreach ($roleDetails['permissions'] as $permission) {
            $guard = $permission['guard_name'];
            if (! isset($rolePermissions[$guard])) {
                $rolePermissions[$guard] = [];
            }
            $rolePermissions[$guard][] = $permission['name'];
        }

        return inertia('admin/roles/edit', [
            'role' => [
                'id' => $roleDetails['id'],
                'name' => $roleDetails['name'],
                'guards' => $roleDetails['guards'],
                'permissions' => $rolePermissions,
            ],
            'permissions' => $groupedPermissions,
        ]);
    }

    /**
     * Update the specified role in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->authorize('update', $role);

        $validated = $request->validated();

        (new UpdateRole)->handle($role, $validated);

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully across all guards.');
    }

    /**
     * Remove the specified role(s) from storage.
     */
    public function destroy($ids, Request $request)
    {
        // Handle bulk deletion with the exact pattern specified
        if ($request->has('ids')) {
            $ids = $request->input('ids');
        }

        $this->authorize('deleteAny', Role::class);

        $result = (new DeleteRoles)->handle($ids);

        return redirect()->route('admin.roles.index')
            ->with($result['success'] ? 'success' : 'error', $result['message']);
    }
}
