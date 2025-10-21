<?php

namespace App\Actions\User;

use App\Models\User;

class DeleteUsers
{
    public function handle($ids, $currentUserId)
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
                'message' => 'No users selected for deletion.',
            ];
        }

        // Prevent users from deleting themselves
        $usersToDelete = User::whereIn('id', $ids)->get();
        $deletableUsers = [];
        $protectedUsers = [];

        foreach ($usersToDelete as $user) {
            if ($user->id === $currentUserId) {
                $protectedUsers[] = $user->name;
            } else {
                $deletableUsers[] = $user->id;
            }
        }

        if (! empty($deletableUsers)) {
            User::whereIn('id', $deletableUsers)->delete();
        }

        if (! empty($protectedUsers)) {
            if (count($protectedUsers) == 1) {
                return [
                    'success' => false,
                    'message' => 'You cannot delete yourself.',
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Cannot delete protected users: '.implode(', ', $protectedUsers).'.',
                ];
            }
        }

        if (count($deletableUsers) == 1) {
            return [
                'success' => true,
                'message' => 'User deleted successfully.',
            ];
        } else {
            return [
                'success' => true,
                'message' => count($deletableUsers).' users deleted successfully.',
            ];
        }
    }
}
