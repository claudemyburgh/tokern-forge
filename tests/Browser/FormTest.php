<?php

namespace Tests\Browser;

use App\Models\User;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class FormTest extends DuskTestCase
{
    public function test_user_can_submit_login_form()
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

    public function test_invalid_login_shows_error()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/sign-in')
                ->type('email', 'invalid@example.com')
                ->type('password', 'wrongpassword')
                ->press('Sign In')
                ->assertSee('These credentials do not match our records.');
        });
    }

    public function test_user_can_register_and_login()
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
