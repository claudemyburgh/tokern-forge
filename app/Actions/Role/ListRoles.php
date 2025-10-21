<?php

namespace App\Actions\Role;

use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Permission\Models\Role;

class ListRoles
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

        // Get all roles and group them by name
        $query = Role::with('permissions');

        // Apply search filter
        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $allRoles = $query->get();

        // Group roles by name
        $groupedRoles = $allRoles->groupBy('name');

        // Create a collection of merged roles for display
        $mergedRoles = [];
        foreach ($groupedRoles as $name => $roles) {
            // Take the first role as the base
            $baseRole = $roles->first();

            // Create a merged representation
            $mergedRole = [
                'id' => $baseRole->id,
                'name' => $name,
                'guards' => $roles->pluck('guard_name')->toArray(),
                'permissions' => $roles->flatMap->permissions->unique('id')->values()->all(),
                'created_at' => $baseRole->created_at,
                'updated_at' => $baseRole->updated_at,
            ];

            $mergedRoles[] = $mergedRole;
        }

        // Convert to a paginated collection for the view
        $currentPage = $validPage;
        $perPageValue = $validPerPage;
        $offset = ($currentPage - 1) * $perPageValue;
        $paginatedRoles = array_slice($mergedRoles, $offset, $perPageValue);

        return new LengthAwarePaginator(
            $paginatedRoles,
            count($mergedRoles),
            $perPageValue,
            $currentPage,
            [
                'path' => request()->url(),
                'pageName' => 'page',
            ]
        );
    }
}
