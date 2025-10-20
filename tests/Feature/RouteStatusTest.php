<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create permissions
    Permission::firstOrCreate(['name' => 'manage users']);
    Permission::firstOrCreate(['name' => 'manage roles']);
    Permission::firstOrCreate(['name' => 'manage permissions']);
    Permission::firstOrCreate(['name' => 'view tokens']);
    Permission::firstOrCreate(['name' => 'create tokens']);
    
    // Create roles
    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $superAdminRole = Role::firstOrCreate(['name' => 'super-admin']);
    
    // Assign permissions to roles
    $adminRole->givePermissionTo(['manage users', 'view tokens', 'create tokens']);
    $superAdminRole->givePermissionTo(['manage users', 'manage roles', 'manage permissions', 'view tokens', 'create tokens']);
    
    // Create users
    $this->adminUser = User::factory()->create();
    $this->adminUser->assignRole('admin');
    
    $this->superAdminUser = User::factory()->create();
    $this->superAdminUser->assignRole('super-admin');
    
    // Create a regular user for testing
    $this->regularUser = User::factory()->create();
});

test('guest routes return 200 status', function () {
    $publicRoutes = [
        '/',
        '/login',
        '/register',
        '/forgot-password',
    ];
    
    foreach ($publicRoutes as $route) {
        $response = $this->get($route);
        $response->assertStatus(200);
    }
});

test('authenticated user routes return 200 status', function () {
    $this->actingAs($this->regularUser);
    
    $userRoutes = [
        '/dashboard',
        '/profile',
    ];
    
    foreach ($userRoutes as $route) {
        $response = $this->get($route);
        $response->assertStatus(200);
    }
});

test('admin routes return 200 status for admin users with manage users permission', function () {
    $this->actingAs($this->adminUser);
    
    // Routes that require 'manage users' permission
    $adminRoutes = [
        '/admin/users',
        '/admin/users/create',
    ];
    
    foreach ($adminRoutes as $route) {
        $response = $this->get($route);
        $response->assertStatus(200);
    }
});

test('admin routes return 200 status for admin users with view tokens permission', function () {
    $this->actingAs($this->adminUser);
    
    // Routes that require 'view tokens' or 'create tokens' permission
    $tokenRoutes = [
        '/tokens',
    ];
    
    foreach ($tokenRoutes as $route) {
        $response = $this->get($route);
        $response->assertStatus(200);
    }
});

test('token creation routes return 200 status for users with create tokens permission', function () {
    $this->actingAs($this->adminUser);
    
    $tokenRoutes = [
        '/tokens/create',
    ];
    
    foreach ($tokenRoutes as $route) {
        $response = $this->get($route);
        $response->assertStatus(200);
    }
});

test('super admin routes return 200 status for super admin users', function () {
    $this->actingAs($this->superAdminUser);
    
    $superAdminRoutes = [
        '/admin/users',
        '/admin/users/create',
        '/admin/roles',
        '/admin/roles/create',
        '/admin/permissions',
        '/admin/permissions/create',
    ];
    
    foreach ($superAdminRoutes as $route) {
        $response = $this->get($route);
        $response->assertStatus(200);
    }
});

test('settings routes return 200 status', function () {
    $this->actingAs($this->regularUser);
    
    $settingsRoutes = [
        '/settings/profile',
        '/settings/password',
    ];
    
    // These routes may redirect to other settings pages
    $response = $this->get('/settings/profile');
    $response->assertStatus(200);
    
    $response = $this->get('/settings/password');
    $response->assertStatus(200);
});