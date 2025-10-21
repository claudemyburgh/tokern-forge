<?php

namespace App\Actions\User;

use App\Models\User;

class ForceDeleteUsers
{
    public function handle($ids, $currentUserId)
    {
        // Handle bulk force deletion with the exact pattern specified
        if (is_string($ids)) {
            $ids = explode(',', $ids);
        } else {
            $ids = (array) $ids;
        }

        // Filter out null values
        $ids = array_filter($ids);

        // Prevent users from force deleting themselves
        $ids = array_filter($ids, function ($id) use ($currentUserId) {
            return $id != $currentUserId;
        });

        if (empty($ids)) {
            return [
                'success' => false,
                'message' => 'No users selected for force deletion or you tried to delete yourself.',
            ];
        }

        $usersToForceDelete = User::withTrashed()->whereIn('id', $ids)->get();
        $forceDeletedUsers = [];

        foreach ($usersToForceDelete as $user) {
            if ($user->trashed()) {
                $user->forceDelete();
                $forceDeletedUsers[] = $user->id;
            }
        }

        if (count($forceDeletedUsers) == 1) {
            return [
                'success' => true,
                'message' => 'User force deleted successfully.',
            ];
        } else {
            return [
                'success' => true,
                'message' => count($forceDeletedUsers).' users force deleted successfully.',
            ];
        }
    }
}
