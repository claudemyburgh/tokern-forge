<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('manage users');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return $user->can('manage users');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('manage users');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        // Prevent users from updating themselves
        if ($user->is($model)) {
            return false;
        }

        return $user->can('manage users');
    }

    /**
     * Determine whether the user can delete any models.
     */
    public function deleteAny(User $user): bool
    {
        return $user->can('manage users');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ?User $model = null): bool
    {
        // If no user model is provided, check general delete permission
        if (! $model) {
            return $user->can('manage users');
        }

        // Prevent users from deleting themselves
        if ($user->is($model)) {
            return false;
        }

        return $user->can('manage users');
    }

    /**
     * Determine whether the user can restore any models.
     */
    public function restoreAny(User $user): bool
    {
        return $user->can('manage users');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ?User $model = null): bool
    {
        // If no user model is provided, check general restore permission
        if (! $model) {
            return $user->can('manage users');
        }

        return $user->can('manage users');
    }

    /**
     * Determine whether the user can permanently delete any models.
     */
    public function forceDeleteAny(User $user): bool
    {
        return $user->can('manage users');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ?User $model = null): bool
    {
        // If no user model is provided, check general force delete permission
        if (! $model) {
            return $user->can('manage users');
        }

        // Prevent users from force deleting themselves
        if ($user->is($model)) {
            return false;
        }

        return $user->can('manage users');
    }
}
