<?php

namespace App\Actions\Permission;

use Spatie\Permission\Models\Permission;

class DeletePermissions
{
    public function handle($ids)
    {
        // Handle bulk deletion with the exact pattern specified
        if (is_string($ids)) {
            $ids = explode(',', $ids);
        } else {
            $ids = (array) $ids;
        }

        // Filter out null values
        $ids = array_filter($ids);

        if (empty($ids)) {
            return [
                'success' => false,
                'message' => 'No permissions selected for deletion.',
            ];
        }

        // Prevent deletion of core permissions
        $corePermissions = [
            'view tokens', 'create tokens', 'edit tokens', 'delete tokens',
            'manage users', 'manage roles', 'manage permissions', 'manage settings',
        ];

        $permissionsToDelete = Permission::whereIn('id', $ids)->get();
        $deletablePermissions = [];
        $protectedPermissions = [];

        foreach ($permissionsToDelete as $permission) {
            if (in_array($permission->name, $corePermissions)) {
                $protectedPermissions[] = $permission->name;
            } else {
                $deletablePermissions[] = $permission->id;
            }
        }

        if (! empty($deletablePermissions)) {
            Permission::whereIn('id', $deletablePermissions)->delete();
        }

        if (! empty($protectedPermissions)) {
            if (count($protectedPermissions) == 1) {
                return [
                    'success' => false,
                    'message' => 'Core permission "'.$protectedPermissions[0].'" cannot be deleted.',
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Core permissions cannot be deleted: '.implode(', ', $protectedPermissions).'.',
                ];
            }
        }

        if (count($deletablePermissions) == 1) {
            return [
                'success' => true,
                'message' => 'Permission deleted successfully.',
            ];
        } else {
            return [
                'success' => true,
                'message' => count($deletablePermissions).' permissions deleted successfully.',
            ];
        }
    }
}
