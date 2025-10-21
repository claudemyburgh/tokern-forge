<?php

namespace App\Actions\User;

use App\Models\User;

class ListUsers
{
    public function handle(array $filters = [])
    {
        $filter = $filters['filter'] ?? 'withoutTrash';
        $perPage = $filters['perPage'] ?? 10;
        $page = $filters['page'] ?? 1;
        $search = $filters['search'] ?? '';

        // Validate perPage value
        $validPerPage = in_array($perPage, [10, 20, 30, 40, 50]) ? $perPage : 10;

        // Validate and cast page to integer
        $validPage = is_numeric($page) ? (int) $page : 1;
        if ($validPage < 1) {
            $validPage = 1;
        }

        $query = User::with('roles');

        // Apply search filter
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        switch ($filter) {
            case 'onlyTrash':
                $query->onlyTrashed();
                break;
            case 'withTrash':
                $query->withTrashed();
                break;
            case 'all':
                $query->withTrashed(); // Explicitly include trashed records
                break;
            case 'withoutTrash':
            default:
                // Default behavior - only active records
                break;
        }

        return $query->latest()->paginate($validPerPage, ['*'], 'page', $validPage);
    }
}
