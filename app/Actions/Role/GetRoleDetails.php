<?php

namespace App\Actions\Role;

use Spatie\Permission\Models\Role;

class GetRoleDetails
{
    public function handle(Role $role)
    {
        // Get all roles with the same name (across different guards)
        $allRoles = Role::where('name', $role->name)->with('permissions')->get();

        // Merge permissions from all guards
        $allPermissions = $allRoles->flatMap->permissions->unique('id')->values()->all();

        // Prepare data for the view
        return [
            'id' => $role->id,
            'name' => $role->name,
            'guards' => $allRoles->pluck('guard_name')->toArray(),
            'permissions' => $allPermissions,
            'created_at' => $role->created_at,
            'updated_at' => $role->updated_at,
        ];
    }
}
