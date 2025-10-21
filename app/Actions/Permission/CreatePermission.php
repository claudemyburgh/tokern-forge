<?php

namespace App\Actions\Permission;

use Spatie\Permission\Models\Permission;

class CreatePermission
{
    public function handle(array $data)
    {
        // Get the guards or default to web
        $guards = $data['guards'] ?? ['web'];

        // Create permissions for each selected guard
        $createdPermissions = [];
        foreach ($guards as $guard) {
            // Check if permission already exists for this guard
            $existingPermission = Permission::where('name', $data['name'])
                ->where('guard_name', $guard)
                ->first();

            if (! $existingPermission) {
                $permission = Permission::create([
                    'name' => $data['name'],
                    'guard_name' => $guard,
                ]);
                $createdPermissions[] = $permission;
            }
        }

        // Assign roles to all created permissions
        if (isset($data['roles']) && ! empty($createdPermissions)) {
            foreach ($createdPermissions as $permission) {
                $permission->assignRole($data['roles']);
            }
        }

        return $createdPermissions;
    }
}
