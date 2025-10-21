<?php

namespace App\Actions\User;

use App\Models\User;

class RestoreUsers
{
    public function handle($ids)
    {
        // Handle bulk restoration with the exact pattern specified
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
                'message' => 'No users selected for restoration.',
            ];
        }

        $usersToRestore = User::withTrashed()->whereIn('id', $ids)->get();
        $restoredUsers = [];

        foreach ($usersToRestore as $user) {
            if ($user->trashed()) {
                $user->restore();
                $restoredUsers[] = $user->id;
            }
        }

        if (count($restoredUsers) == 1) {
            return [
                'success' => true,
                'message' => 'User restored successfully.',
            ];
        } else {
            return [
                'success' => true,
                'message' => count($restoredUsers).' users restored successfully.',
            ];
        }
    }
}
