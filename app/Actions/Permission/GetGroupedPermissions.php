<?php

namespace App\Actions\Permission;

use Spatie\Permission\Models\Permission;

class GetGroupedPermissions
{
    public function handle(): \Illuminate\Database\Eloquent\Collection
    {
        // Get all permissions grouped by guard
        $permissions = Permission::all();

        return $permissions->groupBy('guard_name');
    }
}
