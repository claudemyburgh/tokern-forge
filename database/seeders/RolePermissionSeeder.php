<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            'view tokens',
            'create tokens',
            'edit tokens',
            'delete tokens',
            'manage users',
            'manage settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $roles = [
            'super-admin' => $permissions, // Gets all permissions
            'admin' => ['view tokens', 'create tokens', 'edit tokens', 'delete tokens', 'manage users'],
            'pro' => ['view tokens', 'create tokens', 'edit tokens', 'manage settings'],
            'free' => ['view tokens', 'manage settings', 'manage users'],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);

            if ($roleName === 'super-admin') {
                // Super admin gets all permissions
                $role->givePermissionTo(Permission::all());
            } else {
                $role->givePermissionTo($rolePermissions);
            }
        }
    }
}
