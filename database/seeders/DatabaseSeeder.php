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
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'claude@designbycode.co.za'],
            [
                'name' => 'Claude Myburgh',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            TokenSeeder::class,
        ]);

    }
}
