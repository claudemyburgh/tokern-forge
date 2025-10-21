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
    Permission::create(['name' => 'manage users', 'guard_name' => 'web']);
    Permission::create(['name' => 'manage roles', 'guard_name' => 'web']);
    Permission::create(['name' => 'manage permissions', 'guard_name' => 'web']);

    // Create roles with web guard
    $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
    $superAdminRole = Role::create(['name' => 'super-admin', 'guard_name' => 'web']);

    // Assign permissions to roles using the web guard permissions
    $manageRolesPermission = Permission::where('name', 'manage roles')->where('guard_name', 'web')->first();
    $manageUsersPermission = Permission::where('name', 'manage users')->where('guard_name', 'web')->first();
    $managePermissionsPermission = Permission::where('name', 'manage permissions')->where('guard_name', 'web')->first();

    $adminRole->givePermissionTo($manageRolesPermission);
    $superAdminRole->givePermissionTo([$manageUsersPermission, $manageRolesPermission, $managePermissionsPermission]);

    // Create users
    $this->adminUser = User::factory()->create();
    $this->adminUser->assignRole('admin');

    $this->superAdminUser = User::factory()->create();
    $this->superAdminUser->assignRole('super-admin');

    // Create a regular user for testing
    $this->regularUser = User::factory()->create();

    // Debug: Check if the admin user has the correct permissions
    // dd($this->adminUser->getAllPermissions()->pluck('name'));
});

// Index Tests
test('guests cannot view roles index', function () {
    $this->get(route('admin.roles.index'))->assertRedirect(route('login'));
});

test('users without permission cannot view roles index', function () {
    $this->actingAs($this->regularUser);
    $this->get(route('admin.roles.index'))->assertForbidden();
});

test('users with manage roles permission can view roles index', function () {
    // Debug: Check if the admin user has the correct permissions
    // dd($this->adminUser->getAllPermissions()->pluck('name'));
    $this->actingAs($this->adminUser);
    $this->get(route('admin.roles.index'))->assertOk();
});

test('roles index shows roles', function () {
    $this->actingAs($this->adminUser);

    $roles = [
        Role::create(['name' => 'editor', 'guard_name' => 'web']),
        Role::create(['name' => 'moderator', 'guard_name' => 'web']),
        Role::create(['name' => 'subscriber', 'guard_name' => 'web']),
    ];

    $response = $this->get(route('admin.roles.index'));
    $response->assertOk();

    // Check that roles are displayed
    foreach ($roles as $role) {
        $response->assertSee($role->name);
    }
});

test('roles index can search roles', function () {
    $this->actingAs($this->adminUser);

    $role1 = Role::create(['name' => 'content-editor', 'guard_name' => 'web']);
    $role2 = Role::create(['name' => 'user-moderator', 'guard_name' => 'web']);

    // Search by name
    $response = $this->get(route('admin.roles.index', ['search' => 'content']));
    $response->assertOk();
    $response->assertSee($role1->name);
    $response->assertDontSee($role2->name);
});

// Create Tests
test('users with manage roles permission can view create role page', function () {
    $this->actingAs($this->adminUser);
    $this->get(route('admin.roles.create'))->assertOk();
});

test('users without permission cannot view create role page', function () {
    $this->actingAs($this->regularUser);
    $this->get(route('admin.roles.create'))->assertForbidden();
});

test('roles can be created', function () {
    $this->actingAs($this->adminUser);

    $roleData = [
        'name' => 'new-role',
    ];

    $response = $this->post(route('admin.roles.store'), $roleData);

    $response->assertRedirect(route('admin.roles.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('roles', [
        'name' => 'new-role',
        'guard_name' => 'web',
    ]);
});

test('role creation validates required fields', function () {
    $this->actingAs($this->adminUser);

    $roleData = [
        'name' => '',
    ];

    $response = $this->post(route('admin.roles.store'), $roleData);

    $response->assertSessionHasErrors(['name']);
});

test('role creation validates unique name', function () {
    $this->actingAs($this->adminUser);

    // Create a role first
    Role::create(['name' => 'existing-role', 'guard_name' => 'web']);

    $roleData = [
        'name' => 'existing-role', // Same name
    ];

    $response = $this->post(route('admin.roles.store'), $roleData);

    $response->assertSessionHasErrors(['name']);
});

// Show Tests
test('users with manage roles permission can view role details', function () {
    $this->actingAs($this->adminUser);
    $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);

    $response = $this->get(route('admin.roles.show', $role));
    $response->assertOk();
    $response->assertSee($role->name);
});

test('users without permission cannot view role details', function () {
    $this->actingAs($this->regularUser);
    $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);

    $this->get(route('admin.roles.show', $role))->assertForbidden();
});

// Edit Tests
test('users with manage roles permission can view edit role page', function () {
    $this->actingAs($this->adminUser);
    $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);

    $response = $this->get(route('admin.roles.edit', $role));
    $response->assertOk();
    $response->assertSee($role->name);
});

test('users without permission cannot view edit role page', function () {
    $this->actingAs($this->regularUser);
    $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);

    $this->get(route('admin.roles.edit', $role))->assertForbidden();
});

// Update Tests
test('roles can be updated', function () {
    $this->actingAs($this->adminUser);
    $role = Role::create(['name' => 'old-name', 'guard_name' => 'web']);

    $updatedData = [
        'name' => 'updated-name',
    ];

    $response = $this->put(route('admin.roles.update', $role), $updatedData);

    $response->assertRedirect(route('admin.roles.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('roles', [
        'id' => $role->id,
        'name' => 'updated-name',
        'guard_name' => 'web',
    ]);
});

test('role update validates required fields', function () {
    $this->actingAs($this->adminUser);
    $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);

    $updatedData = [
        'name' => '',
    ];

    $response = $this->put(route('admin.roles.update', $role), $updatedData);

    $response->assertSessionHasErrors(['name']);
});

test('role update validates unique name', function () {
    $this->actingAs($this->adminUser);

    $role1 = Role::create(['name' => 'role-one', 'guard_name' => 'web']);
    $role2 = Role::create(['name' => 'role-two', 'guard_name' => 'web']);

    $updatedData = [
        'name' => 'role-one', // Same as role1
    ];

    $response = $this->put(route('admin.roles.update', $role2), $updatedData);

    $response->assertSessionHasErrors(['name']);
});

test('role update allows same name for same role', function () {
    $this->actingAs($this->adminUser);
    $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);

    $updatedData = [
        'name' => 'test-role', // Same name but for same role
    ];

    $response = $this->put(route('admin.roles.update', $role), $updatedData);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.roles.index'));
});

// Delete Tests
test('roles can be deleted', function () {
    $this->actingAs($this->adminUser);
    $role = Role::create(['name' => 'test-role', 'guard_name' => 'web']);

    $response = $this->delete(route('admin.roles.destroy', $role));

    $response->assertRedirect(route('admin.roles.index'));
    $response->assertSessionHas('success');

    // Check that role is deleted
    $this->assertDatabaseMissing('roles', ['id' => $role->id]);
});

test('super-admin role cannot be deleted', function () {
    $this->actingAs($this->superAdminUser);
    $superAdminRole = Role::where('name', 'super-admin')->where('guard_name', 'web')->first();

    $response = $this->delete(route('admin.roles.destroy', $superAdminRole));

    $response->assertRedirect(route('admin.roles.index'));
    $response->assertSessionHas('error');

    // Check that role still exists
    $this->assertDatabaseHas('roles', ['id' => $superAdminRole->id]);
});

// Bulk Delete Tests
test('roles can be bulk deleted', function () {
    $this->actingAs($this->adminUser);

    $roles = [
        Role::create(['name' => 'role-1', 'guard_name' => 'web']),
        Role::create(['name' => 'role-2', 'guard_name' => 'web']),
        Role::create(['name' => 'role-3', 'guard_name' => 'web']),
    ];

    $roleIds = collect($roles)->pluck('id')->toArray();

    $response = $this->delete(route('admin.roles.bulk.destroy'), ['ids' => $roleIds]);

    $response->assertRedirect(route('admin.roles.index'));
    $response->assertSessionHas('success');

    // Check that roles are deleted
    foreach ($roles as $role) {
        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    }
});

test('super-admin role cannot be bulk deleted', function () {
    $this->actingAs($this->superAdminUser);

    $roles = [
        Role::create(['name' => 'role-1', 'guard_name' => 'web']),
        Role::create(['name' => 'role-2', 'guard_name' => 'web']),
    ];

    // Get the actual super-admin role that was created in beforeEach
    $superAdminRole = Role::where('name', 'super-admin')->where('guard_name', 'web')->first();

    // Add the super-admin role ID to the list
    $roleIds = array_merge(collect($roles)->pluck('id')->toArray(), [$superAdminRole->id]);

    $response = $this->delete(route('admin.roles.bulk.destroy'), ['ids' => $roleIds]);

    $response->assertRedirect(route('admin.roles.index'));
    $response->assertSessionHas('error');

    // Check that regular roles are deleted but super-admin still exists
    $this->assertDatabaseMissing('roles', ['name' => 'role-1']);
    $this->assertDatabaseMissing('roles', ['name' => 'role-2']);
    $this->assertDatabaseHas('roles', ['name' => 'super-admin']);
});
