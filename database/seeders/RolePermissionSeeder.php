<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define the guards
        $guards = ['web', 'api'];

        // Create permissions for each guard
        $permissions = [
            'view tokens',
            'create tokens',
            'edit tokens',
            'delete tokens',
            'manage users',
            'manage roles',
            'manage permissions',
            'manage settings',
        ];

        foreach ($guards as $guard) {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate([
                    'name' => $permission,
                    'guard_name' => $guard,
                ]);
            }
        }

        // Create roles for each guard
        $roles = [
            'super-admin' => $permissions, // Gets all permissions
            'admin' => [
                'view tokens',
                'create tokens',
                'edit tokens',
                'delete tokens',
                'manage users',
                'manage roles',
                'manage permissions',
            ],
            'pro' => ['view tokens', 'create tokens', 'edit tokens', 'manage settings'],
            'free' => ['view tokens', 'manage settings'],
        ];

        foreach ($guards as $guard) {
            foreach ($roles as $roleName => $rolePermissions) {
                $role = Role::firstOrCreate([
                    'name' => $roleName,
                    'guard_name' => $guard,
                ]);

                // Get permission models for this specific guard
                $guardPermissions = [];
                foreach ($rolePermissions as $permission) {
                    $permissionModel = Permission::where('name', $permission)
                        ->where('guard_name', $guard)
                        ->first();
                    if ($permissionModel) {
                        $guardPermissions[] = $permissionModel;
                    }
                }

                // Assign permissions to role (clear any existing permissions first)
                $role->syncPermissions($guardPermissions);
            }
        }
    }
}
