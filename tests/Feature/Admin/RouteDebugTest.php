<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create permissions
    Permission::firstOrCreate(['name' => 'manage users']);
    Permission::firstOrCreate(['name' => 'manage roles']);
    Permission::firstOrCreate(['name' => 'manage permissions']);
    
    // Create roles
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
    
    // Assign permissions to roles
    $adminRole->givePermissionTo('manage users');
    $superAdminRole->givePermissionTo(['manage users', 'manage roles', 'manage permissions']);
    
    // Create users
    $this->adminUser = User::factory()->create();
    $this->adminUser->assignRole('admin');
});

test('debug individual restore route exists', function () {
    $this->actingAs($this->adminUser);
    
    // Create and delete a user
    $user = User::factory()->create();
    $user->delete();
    
    // Check if the route exists by trying to generate it
    $route = route('admin.users.restore', $user);
    echo "Route: " . $route . "\n";
    
    // Try to access the route
    $response = $this->post($route);
    
    // Dump response status
    echo "Status: " . $response->status() . "\n";
    
    // Also try with explicit URL
    $explicitUrl = "/admin/users/" . $user->id . "/restore";
    echo "Explicit URL: " . $explicitUrl . "\n";
    $response2 = $this->post($explicitUrl);
    echo "Explicit URL Status: " . $response2->status() . "\n";
    
    // Check for redirect response (302) which is the correct behavior
    $response->assertRedirect();
});