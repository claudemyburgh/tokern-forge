<?php

namespace App\Actions\Permission;

use Spatie\Permission\Models\Permission;

class UpdatePermission
{
    public function handle(Permission $permission, array $data)
    {
        $permission->update(['name' => $data['name']]);

        if (isset($data['roles'])) {
            $permission->syncRoles($data['roles']);
        } else {
            $permission->syncRoles([]);
        }

        return $permission;
    }
}
