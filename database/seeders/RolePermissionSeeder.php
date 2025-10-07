<?php

namespace Database\Seeders;

use App\Models\User;
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
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'view tokens',
            'create tokens',
            'edit tokens',
            'delete tokens',
            'view users',
            'create users',
            'edit users',
            'delete users',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles
        $superAdmin = Role::create(['name' => 'super-admin']);
        $admin = Role::create(['name' => 'admin']);
        $pro = Role::create(['name' => 'pro']);
        $free = Role::create(['name' => 'free']);

        // Super admin gets all permissions (though they bypass checks anyway)
        $superAdmin->givePermissionTo(Permission::all());

        // Assign permissions to roles
        $admin->givePermissionTo([
            'view tokens', 'create tokens', 'edit tokens', 'delete tokens',
            'view users', 'create users', 'edit users',
        ]);

        $pro->givePermissionTo([
            'view tokens', 'create tokens', 'edit tokens',
        ]);

        $free->givePermissionTo(['view tokens']);

        // Assign role to a user
        $superAdminUser = User::find(1); // Adjust ID as needed
        if ($superAdminUser) {
            $superAdminUser->assignRole('super-admin');
        }
    }
}
