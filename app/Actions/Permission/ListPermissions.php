<?php

namespace App\Actions\Permission;

use Spatie\Permission\Models\Permission;

class ListPermissions
{
    public function handle(array $filters = [])
    {
        $filter = $filters['filter'] ?? 'all';
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

        $query = Permission::with('roles');

        // Apply search filter
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        // Permissions don't have soft deletes, so we only support basic filtering
        // The 'all' filter is the only relevant option since there are no trashed records
        switch ($filter) {
            case 'all':
            default:
                // Default behavior - all records
                break;
        }

        return $query->latest()->paginate($validPerPage, ['*'], 'page', $validPage);
    }
}
