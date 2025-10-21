<?php

namespace App\Actions\Role;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UpdateRole
{
    public function handle(Role $role, array $data)
    {
        // Get all roles with the same name (across different guards)
        $allRoles = Role::where('name', $role->name)->get();

        // Update the name for all roles with the same name (only if name is provided)
        if (isset($data['name']) && $data['name'] !== $role->name) {
            foreach ($allRoles as $r) {
                $r->update(['name' => $data['name']]);
            }
            // Update the main role reference
            $role->refresh();
        }

        // Handle permissions for each guard
        if (isset($data['permissions'])) {
            foreach ($allRoles as $r) {
                $guard = $r->guard_name;
                $permissionIds = [];

                // Get permissions for this specific guard
                if (isset($data['permissions'][$guard]) && is_array($data['permissions'][$guard])) {
                    foreach ($data['permissions'][$guard] as $permissionName) {
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
        }

        return $role;
    }
}
