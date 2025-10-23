<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\Models\User;

class FormTest extends DuskTestCase
{
    public function testUserCanSubmitLoginForm()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/sign-in')
                    ->type('email', $user->email)
                    ->type('password', 'password')
                    ->press('Sign In')
                    ->assertPathIs('/dashboard')
                    ->assertSee('Dashboard');
        });
    }

    public function testInvalidLoginShowsError()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/sign-in')
                    ->type('email', 'invalid@example.com')
                    ->type('password', 'wrongpassword')
                    ->press('Sign In')
                    ->assertSee('These credentials do not match our records.');
        });
    }

    public function testUserCanRegisterAndLogin()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/sign-up')
                    ->type('name', 'Test User')
                    ->type('email', 'newuser@example.com')
                    ->type('password', 'password')
                    ->type('password_confirmation', 'password')
                    ->press('Sign Up')
                    ->assertPathIs('/dashboard')
                    ->assertSee('Dashboard');
        });
    }
}
