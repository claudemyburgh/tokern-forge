<?php

namespace App\Actions\Role;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateRole
{
    public function handle(array $data)
    {
        $role = Role::create(['name' => $data['name']]);

        if (isset($data['permissions'])) {
            // Handle permissions with guards
            $permissionIds = [];
            foreach ($data['permissions'] as $guard => $perms) {
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
            if (! empty($permissionIds)) {
                $role->syncPermissions($permissionIds);
            }
        }

        return $role;
    }
}
