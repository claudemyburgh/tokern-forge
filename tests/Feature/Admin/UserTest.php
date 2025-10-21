<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
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
    $manageUsersPermission = Permission::where('name', 'manage users')->where('guard_name', 'web')->first();
    $manageRolesPermission = Permission::where('name', 'manage roles')->where('guard_name', 'web')->first();
    $managePermissionsPermission = Permission::where('name', 'manage permissions')->where('guard_name', 'web')->first();

    $adminRole->givePermissionTo($manageUsersPermission);
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
test('guests cannot view users index', function () {
    $this->get(route('admin.users.index'))->assertRedirect(route('login'));
});

test('users without permission cannot view users index', function () {
    $this->actingAs($this->regularUser);
    $this->get(route('admin.users.index'))->assertForbidden();
});

test('users with manage users permission can view users index', function () {
    $this->actingAs($this->adminUser);
    $this->get(route('admin.users.index'))->assertOk();
});

test('users index shows users', function () {
    $this->actingAs($this->adminUser);
    $users = User::factory(5)->create();

    $response = $this->get(route('admin.users.index'));
    $response->assertOk();

    // Check that users are displayed
    foreach ($users as $user) {
        $response->assertSee($user->name);
        $response->assertSee($user->email);
    }
});

test('users index can search users', function () {
    $this->actingAs($this->adminUser);

    $user1 = User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
    $user2 = User::factory()->create(['name' => 'Jane Smith', 'email' => 'jane@example.com']);

    // Search by name
    $response = $this->get(route('admin.users.index', ['search' => 'John']));
    $response->assertOk();
    $response->assertSee($user1->name);
    $response->assertDontSee($user2->name);

    // Search by email
    $response = $this->get(route('admin.users.index', ['search' => 'jane@example.com']));
    $response->assertOk();
    $response->assertSee($user2->name);
    $response->assertDontSee($user1->name);
});

test('users index can filter users', function () {
    $this->actingAs($this->adminUser);

    // Create a user and delete them
    $deletedUser = User::factory()->create(['name' => 'Deleted User']);
    $deletedUser->delete();

    $activeUser = User::factory()->create(['name' => 'Active User']);

    // Test withoutTrash filter (default)
    $response = $this->get(route('admin.users.index', ['filter' => 'withoutTrash']));
    $response->assertOk();
    $response->assertSee($activeUser->name);
    $response->assertDontSee($deletedUser->name);

    // Test withTrash filter
    $response = $this->get(route('admin.users.index', ['filter' => 'withTrash']));
    $response->assertOk();
    $response->assertSee($activeUser->name);
    $response->assertSee($deletedUser->name);

    // Test onlyTrash filter
    $response = $this->get(route('admin.users.index', ['filter' => 'onlyTrash']));
    $response->assertOk();
    $response->assertDontSee($activeUser->name);
    $response->assertSee($deletedUser->name);
});

// Create Tests
test('users with manage users permission can view create user page', function () {
    $this->actingAs($this->adminUser);
    $this->get(route('admin.users.create'))->assertOk();
});

test('users without permission cannot view create user page', function () {
    $this->actingAs($this->regularUser);
    $this->get(route('admin.users.create'))->assertForbidden();
});

test('users can be created', function () {
    $this->actingAs($this->adminUser);

    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('admin.users.store'), $userData);

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    // Check that password was hashed
    $user = User::where('email', 'test@example.com')->first();
    expect(Hash::check('password123', $user->password))->toBeTrue();
});

test('user creation validates required fields', function () {
    $this->actingAs($this->adminUser);

    $userData = [
        'name' => '',
        'email' => '',
        'password' => '',
        'password_confirmation' => '',
    ];

    $response = $this->post(route('admin.users.store'), $userData);

    $response->assertSessionHasErrors(['name', 'email', 'password']);
});

test('user creation validates email format', function () {
    $this->actingAs($this->adminUser);

    $userData = [
        'name' => 'Test User',
        'email' => 'invalid-email',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('admin.users.store'), $userData);

    $response->assertSessionHasErrors(['email']);
});

test('user creation validates password confirmation', function () {
    $this->actingAs($this->adminUser);

    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'differentpassword',
    ];

    $response = $this->post(route('admin.users.store'), $userData);

    $response->assertSessionHasErrors(['password']);
});

test('user creation validates unique email', function () {
    $this->actingAs($this->adminUser);

    // Create a user first
    $existingUser = User::factory()->create(['email' => 'test@example.com']);

    $userData = [
        'name' => 'Test User',
        'email' => 'test@example.com', // Same email
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post(route('admin.users.store'), $userData);

    $response->assertSessionHasErrors(['email']);
});

// Show Tests
test('users with manage users permission can view user details', function () {
    $this->actingAs($this->adminUser);
    $user = User::factory()->create();

    $response = $this->get(route('admin.users.show', $user));
    $response->assertOk();
    $response->assertSee($user->name);
    $response->assertSee($user->email);
});

test('users without permission cannot view user details', function () {
    $this->actingAs($this->regularUser);
    $user = User::factory()->create();

    $this->get(route('admin.users.show', $user))->assertForbidden();
});

// Edit Tests
test('users with manage users permission can view edit user page', function () {
    $this->actingAs($this->adminUser);
    $user = User::factory()->create();

    $response = $this->get(route('admin.users.edit', $user));
    $response->assertOk();
    $response->assertSee($user->name);
    $response->assertSee($user->email);
});

test('users without permission cannot view edit user page', function () {
    $this->actingAs($this->regularUser);
    $user = User::factory()->create();

    $this->get(route('admin.users.edit', $user))->assertForbidden();
});

// Update Tests
test('users can be updated', function () {
    $this->actingAs($this->adminUser);
    $user = User::factory()->create();

    $updatedData = [
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ];

    $response = $this->put(route('admin.users.update', $user), $updatedData);

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'Updated Name',
        'email' => 'updated@example.com',
    ]);

    // Check that password was updated
    $user->refresh();
    expect(Hash::check('newpassword123', $user->password))->toBeTrue();
});

test('user update validates required fields', function () {
    $this->actingAs($this->adminUser);
    $user = User::factory()->create();

    $updatedData = [
        'name' => '',
        'email' => '',
    ];

    $response = $this->put(route('admin.users.update', $user), $updatedData);

    $response->assertSessionHasErrors(['name', 'email']);
});

test('user update validates unique email', function () {
    $this->actingAs($this->adminUser);

    $user1 = User::factory()->create(['email' => 'user1@example.com']);
    $user2 = User::factory()->create(['email' => 'user2@example.com']);

    $updatedData = [
        'name' => 'Updated Name',
        'email' => 'user1@example.com', // Same as user1
    ];

    $response = $this->put(route('admin.users.update', $user2), $updatedData);

    $response->assertSessionHasErrors(['email']);
});

test('user update allows same email for same user', function () {
    $this->actingAs($this->adminUser);
    $user = User::factory()->create(['email' => 'user@example.com']);

    $updatedData = [
        'name' => 'Updated Name',
        'email' => 'user@example.com', // Same email but for same user
    ];

    $response = $this->put(route('admin.users.update', $user), $updatedData);

    $response->assertSessionHasNoErrors();
    $response->assertRedirect(route('admin.users.index'));
});

// Delete Tests
test('users can be deleted', function () {
    $this->actingAs($this->adminUser);
    $user = User::factory()->create();

    $response = $this->delete(route('admin.users.destroy', $user));

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    // Check that user is soft deleted
    $this->assertSoftDeleted($user);
});

test('users cannot delete themselves', function () {
    $this->actingAs($this->adminUser);

    $response = $this->delete(route('admin.users.destroy', $this->adminUser));

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('error');

    // Check that user still exists
    $this->assertDatabaseHas('users', ['id' => $this->adminUser->id]);
});

test('super admin cannot delete themselves', function () {
    $this->actingAs($this->superAdminUser);

    $response = $this->delete(route('admin.users.destroy', $this->superAdminUser));

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('error');

    // Check that user still exists
    $this->assertDatabaseHas('users', ['id' => $this->superAdminUser->id]);
});

// Bulk Delete Tests
test('users can be bulk deleted', function () {
    $this->actingAs($this->adminUser);

    $users = User::factory(3)->create();
    $userIds = $users->pluck('id')->toArray();

    $response = $this->delete(route('admin.users.bulk.destroy'), ['ids' => $userIds]);

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    // Check that users are soft deleted
    foreach ($users as $user) {
        $this->assertSoftDeleted($user);
    }
});

test('users cannot bulk delete themselves', function () {
    $this->actingAs($this->adminUser);

    $users = User::factory(2)->create();
    $userIds = array_merge($users->pluck('id')->toArray(), [$this->adminUser->id]);

    $response = $this->delete(route('admin.users.bulk.destroy'), ['ids' => $userIds]);

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('error');

    // Check that other users are deleted but admin user still exists
    foreach ($users as $user) {
        $this->assertSoftDeleted($user);
    }
    $this->assertDatabaseHas('users', ['id' => $this->adminUser->id]);
});

// Restore Tests
test('users can be restored', function () {
    $this->actingAs($this->adminUser);

    $user = User::factory()->create();
    $user->delete();

    $response = $this->post(route('admin.users.restore', $user));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Check that user is restored
    $this->assertNotSoftDeleted($user);
});

test('users can be bulk restored', function () {
    $this->actingAs($this->adminUser);

    $users = User::factory(3)->create();
    foreach ($users as $user) {
        $user->delete();
    }

    $userIds = $users->pluck('id')->toArray();

    $response = $this->post(route('admin.users.bulk.restore'), ['ids' => $userIds]);

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    // Check that users are restored
    foreach ($users as $user) {
        $this->assertNotSoftDeleted($user);
    }
});

// Force Delete Tests
test('users can be force deleted', function () {
    $this->actingAs($this->adminUser);

    $user = User::factory()->create();
    $user->delete(); // Soft delete first

    $response = $this->delete(route('admin.users.force-delete', $user));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    // Check that user is permanently deleted
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('users cannot force delete themselves', function () {
    $this->actingAs($this->adminUser);

    // Soft delete the user first
    $this->adminUser->delete();

    $response = $this->delete(route('admin.users.force-delete', $this->adminUser));

    $response->assertRedirect();
    $response->assertSessionHas('error');

    // Check that user still exists in database
    $this->assertDatabaseHas('users', ['id' => $this->adminUser->id]);
});

test('users can be bulk force deleted', function () {
    $this->actingAs($this->adminUser);

    $users = User::factory(3)->create();
    foreach ($users as $user) {
        $user->delete(); // Soft delete first
    }

    $userIds = $users->pluck('id')->toArray();

    $response = $this->delete(route('admin.users.bulk.force-delete'), ['ids' => $userIds]);

    $response->assertRedirect(route('admin.users.index'));
    $response->assertSessionHas('success');

    // Check that users are permanently deleted
    foreach ($users as $user) {
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
});
