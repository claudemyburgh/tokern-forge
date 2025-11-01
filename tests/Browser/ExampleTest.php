<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ExampleTest extends DuskTestCase
{
    public function test_basic_page_navigation()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                ->assertSee('Token Forge')
                ->assertSee('Welcome');
        });
    }

    public function test_navigation_to_dashboard_requires_authentication()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/dashboard')
                ->assertSee('Sign In');
        });
    }
}
