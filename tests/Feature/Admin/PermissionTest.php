<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Set the database connection to sqlite for testing
    putenv('DB_CONNECTION=sqlite');
    putenv('DB_DATABASE=:memory:');

    // Create permissions for the web guard (which is what we use in tests)
    Permission::firstOrCreate(['name' => 'manage users', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'manage roles', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'manage permissions', 'guard_name' => 'web']);

    // Create roles with web guard
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $superAdminRole = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);

    // Assign permissions to roles using the web guard permissions
    $managePermissionsPermission = Permission::where('name', 'manage permissions')->where('guard_name', 'web')->first();
    $manageUsersPermission = Permission::where('name', 'manage users')->where('guard_name', 'web')->first();
    $manageRolesPermission = Permission::where('name', 'manage roles')->where('guard_name', 'web')->first();

    $adminRole->givePermissionTo($managePermissionsPermission);
    $superAdminRole->givePermissionTo([$manageUsersPermission, $manageRolesPermission, $managePermissionsPermission]);

    // Create users
    $this->adminUser = User::factory()->create();
    $this->adminUser->assignRole('admin');

    $this->superAdminUser = User::factory()->create();
    $this->superAdminUser->assignRole('super-admin');

    // Create a regular user for testing
    $this->regularUser = User::factory()->create();
});

// Index Tests
test('guests cannot view permissions index', function () {
    $this->get(route('admin.permissions.index'))->assertRedirect(route('login'));
});

test('users without permission cannot view permissions index', function () {
    $this->actingAs($this->regularUser);
    $this->get(route('admin.permissions.index'))->assertForbidden();
});

test('users with manage permissions permission can view permissions index', function () {
    $this->actingAs($this->adminUser);
    $this->get(route('admin.permissions.index'))->assertOk();
});

test('permissions index shows permissions', function () {
    $this->actingAs($this->adminUser);

    $permissions = [
        Permission::firstOrCreate(['name' => 'view-dashboard', 'guard_name' => 'web']),
        Permission::firstOrCreate(['name' => 'edit-profile', 'guard_name' => 'web']),
        Permission::firstOrCreate(['name' => 'manage-settings', 'guard_name' => 'web']),
    ];

    $response = $this->get(route('admin.permissions.index'));
    $response->assertOk();

    // Check that permissions are displayed
    foreach ($permissions as $permission) {
        $response->assertSee($permission->name);
    }
});

test('permissions index can search permissions', function () {
    $this->actingAs($this->adminUser);

    $permission1 = Permission::firstOrCreate(['name' => 'user-management', 'guard_name' => 'web']);
    $permission2 = Permission::firstOrCreate(['name' => 'role-management', 'guard_name' => 'web']);

    // Search by name
    $response = $this->get(route('admin.permissions.index', ['search' => 'user']));
    $response->assertOk();
    $response->assertSee($permission1->name);
    $response->assertDontSee($permission2->name);
});

// Create Tests
test('users with manage permissions permission can view create permission page', function () {
    $this->actingAs($this->adminUser);
    $this->get(route('admin.permissions.create'))->assertOk();
});

test('users without permission cannot view create permission page', function () {
    $this->actingAs($this->regularUser);
    $this->get(route('admin.permissions.create'))->assertForbidden();
});

test('permissions can be created', function () {
    $this->actingAs($this->adminUser);

    $permissionData = [
        'name' => 'new-permission',
        'guards' => ['web'],
    ];

    $response = $this->post(route('admin.permissions.store'), $permissionData);

    $response->assertRedirect(route('admin.permissions.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('permissions', [
        'name' => 'new-permission',
        'guard_name' => 'web',
    ]);
});

test('permission creation validates required fields', function () {
    $this->actingAs($this->adminUser);

    $permissionData = [
        'name' => '',
    ];

    $response = $this->post(route('admin.permissions.store'), $permissionData);

    $response->assertSessionHasErrors(['name']);
});

test('permission creation validates unique name', function () {
    $this->actingAs($this->adminUser);

    // Create a permission first
    Permission::firstOrCreate(['name' => 'existing-permission', 'guard_name' => 'web']);

    $permissionData = [
        'name' => 'existing-permission', // Same name
        'guards' => ['web'],
    ];

    $response = $this->post(route('admin.permissions.store'), $permissionData);

    $response->assertSessionHasErrors(['name']);
});

// Show Tests
test('users with manage permissions permission can view permission details', function () {
    $this->actingAs($this->adminUser);
    $permission = Permission::firstOrCreate(['name' => 'test-permission', 'guard_name' => 'web']);

    $response = $this->get(route('admin.permissions.show', $permission));
    $response->assertOk();
    $response->assertSee($permission->name);
});

test('users without permission cannot view permission details', function () {
    $this->actingAs($this->regularUser);
    $permission = Permission::firstOrCreate(['name' => 'test-permission', 'guard_name' => 'web']);

    $this->get(route('admin.permissions.show', $permission))->assertForbidden();
});

// Edit Tests
test('users with manage permissions permission can view edit permission page', function () {
    $this->actingAs($this->adminUser);
    $permission = Permission::firstOrCreate(['name' => 'test-permission', 'guard_name' => 'web']);

    $response = $this->get(route('admin.permissions.edit', $permission));
    $response->assertOk();
    $response->assertSee($permission->name);
});

test('users without permission cannot view edit permission page', function () {
    $this->actingAs($this->regularUser);
    $permission = Permission::firstOrCreate(['name' => 'test-permission', 'guard_name' => 'web']);

    $this->get(route('admin.permissions.edit', $permission))->assertForbidden();
});

// Update Tests
test('permissions can be updated', function () {
    $this->actingAs($this->adminUser);
    $permission = Permission::firstOrCreate(['name' => 'old-name', 'guard_name' => 'web']);

    $updatedData = [
        'name' => 'updated-name',
    ];

    $response = $this->put(route('admin.permissions.update', $permission), $updatedData);

    $response->assertRedirect(route('admin.permissions.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('permissions', [
        'id' => $permission->id,
        'name' => 'updated-name',
        'guard_name' => 'web',
    ]);
});

test('permission update validates required fields', function () {
    $this->actingAs($this->adminUser);
    $permission = Permission::firstOrCreate(['name' => 'test-permission', 'guard_name' => 'web']);

    $updatedData = [
        'name' => '',
    ];

    $response = $this->put(route('admin.permissions.update', $permission), $updatedData);

    $response->assertSessionHasErrors(['name']);
});

test('permission update validates unique name', function () {
    $this->actingAs($this->adminUser);

    $permission1 = Permission::firstOrCreate(['name' => 'permission-one', 'guard_name' => 'web']);
    $permission2 = Permission::firstOrCreate(['name' => 'permission-two', 'guard_name' => 'web']);

    $updatedData = [
        'name' => 'permission-one', // Same as permission1
    ];

    $response = $this->put(route('admin.permissions.update', $permission2), $updatedData);

    $response->assertSessionHasErrors(['name']);
});

test('permission update allows same name for same permission', function () {
    $this->actingAs($this->adminUser);
    $permission = Permission::firstOrCreate(['name' => 'test-permission', 'guard_name' => 'web']);

    $updatedData = [
        'name' => 'test-permission', // Same name but for same permission
    ];

    $response = $this->put(route('admin.permissions.update', $permission), $updatedData);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.permissions.index'));
});

// Delete Tests
test('permissions can be deleted', function () {
    $this->actingAs($this->adminUser);
    $permission = Permission::firstOrCreate(['name' => 'test-permission', 'guard_name' => 'web']);

    $response = $this->delete(route('admin.permissions.destroy', $permission));

    $response->assertRedirect(route('admin.permissions.index'));
    $response->assertSessionHas('success');

    // Check that permission is deleted
    $this->assertDatabaseMissing('permissions', ['id' => $permission->id]);
});

test('core permissions cannot be deleted', function () {
    $this->actingAs($this->superAdminUser);

    $corePermissions = ['view tokens', 'create tokens', 'edit tokens', 'delete tokens', 'manage users', 'manage roles', 'manage permissions', 'manage settings'];

    foreach ($corePermissions as $permName) {
        Permission::firstOrCreate(['name' => $permName, 'guard_name' => 'web']);
    }

    $permission = Permission::where('name', 'manage users')->where('guard_name', 'web')->first();

    $response = $this->delete(route('admin.permissions.destroy', $permission));

    $response->assertRedirect(route('admin.permissions.index'));
    $response->assertSessionHas('error');

    // Check that permission still exists
    $this->assertDatabaseHas('permissions', ['id' => $permission->id]);
});

// Bulk Delete Tests
test('permissions can be bulk deleted', function () {
    $this->actingAs($this->adminUser);

    $permissions = [
        Permission::firstOrCreate(['name' => 'permission-1', 'guard_name' => 'web']),
        Permission::firstOrCreate(['name' => 'permission-2', 'guard_name' => 'web']),
        Permission::firstOrCreate(['name' => 'permission-3', 'guard_name' => 'web']),
    ];

    $permissionIds = collect($permissions)->pluck('id')->toArray();

    $response = $this->delete(route('admin.permissions.bulk.destroy'), ['ids' => $permissionIds]);

    $response->assertRedirect(route('admin.permissions.index'));
    $response->assertSessionHas('success');

    // Check that permissions are deleted
    foreach ($permissions as $permission) {
        $this->assertDatabaseMissing('permissions', ['id' => $permission->id]);
    }
});

test('core permissions cannot be bulk deleted', function () {
    $this->actingAs($this->superAdminUser);

    $corePermissions = ['manage users', 'manage roles', 'manage permissions'];

    foreach ($corePermissions as $permName) {
        Permission::firstOrCreate(['name' => $permName, 'guard_name' => 'web']);
    }

    $permissions = [
        Permission::firstOrCreate(['name' => 'regular-permission-1', 'guard_name' => 'web']),
        Permission::firstOrCreate(['name' => 'regular-permission-2', 'guard_name' => 'web']),
        Permission::where('name', 'manage users')->where('guard_name', 'web')->first(),
    ];

    $permissionIds = collect($permissions)->pluck('id')->toArray();

    $response = $this->delete(route('admin.permissions.bulk.destroy'), ['ids' => $permissionIds]);

    $response->assertRedirect(route('admin.permissions.index'));
    $response->assertSessionHas('error');

    // Check that regular permissions are deleted but core permissions still exist
    $this->assertDatabaseMissing('permissions', ['name' => 'regular-permission-1']);
    $this->assertDatabaseMissing('permissions', ['name' => 'regular-permission-2']);
    $this->assertDatabaseHas('permissions', ['name' => 'manage users']);
    $this->assertDatabaseHas('permissions', ['name' => 'manage roles']);
    $this->assertDatabaseHas('permissions', ['name' => 'manage permissions']);
});
