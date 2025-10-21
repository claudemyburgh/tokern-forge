<?php

namespace App\Actions\Role;

use Spatie\Permission\Models\Role;

class DeleteRoles
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
                'message' => 'No roles selected for deletion.',
            ];
        }

        // Prevent deletion of super-admin role
        $rolesToDelete = Role::whereIn('id', $ids)->get();
        $deletableRoles = [];
        $protectedRoles = [];

        foreach ($rolesToDelete as $role) {
            if ($role->name === 'super-admin') {
                $protectedRoles[] = $role->name;
            } else {
                $deletableRoles[] = $role->id;
            }
        }

        if (! empty($deletableRoles)) {
            Role::whereIn('id', $deletableRoles)->delete();
        }

        if (! empty($protectedRoles)) {
            if (count($protectedRoles) == 1) {
                return [
                    'success' => false,
                    'message' => 'The super-admin role cannot be deleted.',
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Protected roles cannot be deleted: '.implode(', ', $protectedRoles).'.',
                ];
            }
        }

        if (count($deletableRoles) == 1) {
            return [
                'success' => true,
                'message' => 'Role deleted successfully.',
            ];
        } else {
            return [
                'success' => true,
                'message' => count($deletableRoles).' roles deleted successfully.',
            ];
        }
    }
}
