<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call the role and permission seeder first
        $this->call([
            RolePermissionSeeder::class,
        ]);

        // Create or update the default user (without explicitly assigning role)
        $user = User::firstOrCreate(
            ['email' => 'claude@designbycode.co.za'],
            [
                'name' => 'Claude Myburgh',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Create another test user to verify observer works
        $testUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            TokenSeeder::class,
        ]);
    }
}
