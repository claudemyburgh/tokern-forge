<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ExampleTest extends DuskTestCase
{
    public function testBasicPageNavigation()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->assertSee('Token Forge')
                    ->assertSee('Welcome');
        });
    }

    public function testNavigationToDashboardRequiresAuthentication()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/dashboard')
                    ->assertSee('Sign In');
        });
    }
}
