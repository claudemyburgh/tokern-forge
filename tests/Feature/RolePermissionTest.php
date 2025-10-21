<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Run the role permission seeder to populate permissions
    $this->artisan('db:seed', ['--class' => 'RolePermissionSeeder']);
});

it('can create role with permissions', function () {
    // Get existing permissions
    $permissions = Permission::all();
    expect($permissions)->not->toBeEmpty();

    // Create a role
    $role = Role::create(['name' => 'test-role']);

    // Assign permissions to role
    $role->givePermissionTo($permissions->first());

    // Verify the role has the permission
    expect($role->hasPermissionTo($permissions->first()))->toBeTrue();
});

it('handles nonexistent permissions gracefully', function () {
    // Create a role
    $role = Role::create(['name' => 'test-role-2']);

    // Try to assign a permission by name that doesn't exist
    $permissionNames = ['view tokens', 'nonexistent-permission'];

    $permissionIds = [];
    foreach ($permissionNames as $permissionName) {
        $permission = Permission::where('name', $permissionName)
            ->where('guard_name', 'web')
            ->first();
        if ($permission) {
            $permissionIds[] = $permission->id;
        }
    }

    // Only the existing permission should be added
    $role->syncPermissions($permissionIds);

    // Should only have 1 permission (the one that exists)
    expect($role->permissions->count())->toBe(1);
});
