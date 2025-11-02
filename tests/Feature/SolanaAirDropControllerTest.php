<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('displays the solana airdrop page', function () {
    $response = $this->actingAs($this->user)
        ->get(route('tools.solana-air-drop'));

    $response->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('tools/solana-air-drop'));
});

it('validates required fields', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), []);

    $response->assertSessionHasErrors(['wallet', 'amount', 'network']);
});

it('validates wallet address format', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => 'invalid-wallet',
            'amount' => 1.0,
            'network' => 'devnet',
        ]);

    $response->assertSessionHasErrors(['wallet']);
});

it('validates amount range', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w',
            'amount' => 0.05, // Below minimum
            'network' => 'devnet',
        ]);

    $response->assertSessionHasErrors(['amount']);

    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w',
            'amount' => 10, // Above maximum
            'network' => 'devnet',
        ]);

    $response->assertSessionHasErrors(['amount']);
});

it('only allows devnet network', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w',
            'amount' => 1.0,
            'network' => 'mainnet',
        ]);

    $response->assertSessionHasErrors(['network']);
});

it('processes valid airdrop request in testing environment', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w',
            'amount' => 1.0,
            'network' => 'devnet',
        ]);

    $response->assertSessionHas('success', true)
        ->assertSessionHas('amount', 1.0)
        ->assertSessionHas('wallet', '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w')
        ->assertSessionHas('signature');
});

it('validates wallet address with base58 regex', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '0123456789abcdef0123456789abcdef01234567', // Invalid characters
            'amount' => 1.0,
            'network' => 'devnet',
        ]);

    $response->assertSessionHasErrors(['wallet']);
});

it('accepts valid amount values', function () {
    $validAmounts = [0.1, 0.25, 0.5, 1.0, 2.5, 5.0];

    foreach ($validAmounts as $amount) {
        Cache::flush(); // Clear cache between tests
        
        $response = $this->actingAs($this->user)
            ->post(route('tools.solana-air-drop.request'), [
                'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w',
                'amount' => $amount,
                'network' => 'devnet',
            ]);

        $response->assertSessionHasNoErrors()
            ->assertSessionHas('success', true)
            ->assertSessionHas('amount', $amount);
    }
});

it('handles wallet address length validation', function () {
    // Too short
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n',
            'amount' => 1.0,
            'network' => 'devnet',
        ]);

    $response->assertSessionHasErrors(['wallet']);

    // Too long
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w2x1y9z',
            'amount' => 1.0,
            'network' => 'devnet',
        ]);

    $response->assertSessionHasErrors(['wallet']);
});