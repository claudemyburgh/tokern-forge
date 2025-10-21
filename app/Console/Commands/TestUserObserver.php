<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class TestUserObserver extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-user-observer';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test if UserObserver assigns free role to new users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Generate a unique email for testing
        $uniqueEmail = 'observer-'.time().'@test.com';

        // Create a new user
        $user = User::create([
            'name' => 'Observer Test User',
            'email' => $uniqueEmail,
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        // Check if the user has the free role
        if ($user->hasRole('free')) {
            $this->info('SUCCESS: UserObserver correctly assigned the "free" role to the new user.');
        } else {
            $this->error('ERROR: UserObserver did not assign the "free" role to the new user.');
        }

        // Display the user's roles
        $roles = $user->roles->pluck('name')->toArray();
        $this->line('User roles: '.implode(', ', $roles));

        // Clean up - delete the test user
        $user->delete();
    }
}
