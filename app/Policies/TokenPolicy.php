<?php

namespace App\Policies;

use App\Models\Token;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TokenPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAll(User $user): bool
    {
        return $user->hasRole('admin') || $user->can('view all tokens');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Token $token): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create tokens');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Token $token): bool
    {
        return $user->can('edit tokens') && $token->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Token $token): bool
    {
        // Users can delete their own tokens
        // Admins can delete any token
        return ($user->can('delete tokens') && $token->user_id === $user->id)
            || $user->hasRole('admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Token $token): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Token $token): bool
    {
        // Users can delete their own tokens
        // Admins can delete any token
        return $user->can('delete tokens') || $user->hasRole('admin');
    }
}
