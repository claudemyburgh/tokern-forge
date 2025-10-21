<?php

namespace App\Policies;

use App\Models\User;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('manage roles');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Role $role): bool
    {
        return $user->can('manage roles');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('manage roles');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Role $role): bool
    {
        // Prevent updating super-admin role name, but allow updating permissions
        if ($role->name === 'super-admin') {
            // Check if the request is trying to change the name
            $requestData = request()->all();
            $isNameChange = isset($requestData['name']) && $requestData['name'] !== $role->name;

            // Allow updates as long as we're not changing the name
            if (! $isNameChange) {
                return $user->can('manage roles');
            }

            // For name changes to super-admin, deny
            return false;
        }

        return $user->can('manage roles');
    }

    /**
     * Determine whether the user can delete any models.
     */
    public function deleteAny(User $user): bool
    {
        return $user->can('manage roles');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ?Role $role = null): bool
    {
        // If no role is provided, check general delete permission
        if (! $role) {
            return $user->can('manage roles');
        }

        // Prevent deletion of super-admin role
        if ($role->name === 'super-admin') {
            return false;
        }

        return $user->can('manage roles');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Role $role): bool
    {
        return $user->can('manage roles');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Role $role): bool
    {
        // Prevent force deletion of super-admin role
        if ($role->name === 'super-admin') {
            return false;
        }

        return $user->can('manage roles');
    }
}
