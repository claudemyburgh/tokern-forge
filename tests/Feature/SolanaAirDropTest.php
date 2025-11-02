<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create a user for testing
    $this->user = User::factory()->create();
});

it('can display the solana airdrop page', function () {
    $response = $this->actingAs($this->user)
        ->get(route('tools.solana-air-drop'));

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('tools/solana-air-drop')
    );
});

it('can request a solana airdrop with valid data', function () {
    // This test would require mocking the HTTP calls to Solana
    // For now, we'll just test the validation
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w',
            'amount' => 1.0,
            'network' => 'devnet',
            'email' => 'test@example.com',
        ]);

    // We expect this to pass validation but fail at the HTTP request level
    // since we're not mocking the external API calls
    $response->assertSessionHasNoErrors();
});

it('rejects airdrop request with invalid wallet address', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => 'invalid-wallet-address',
            'amount' => 1.0,
            'network' => 'devnet',
        ]);

    $response->assertSessionHasErrors(['wallet']);
});

it('rejects airdrop request with amount too low', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w',
            'amount' => 0.05, // Below minimum of 0.1
            'network' => 'devnet',
        ]);

    $response->assertSessionHasErrors(['amount']);
});

it('rejects airdrop request with amount too high', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w',
            'amount' => 10, // Above maximum of 5
            'network' => 'devnet',
        ]);

    $response->assertSessionHasErrors(['amount']);
});

it('rejects airdrop request without wallet address', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'amount' => 1.0,
            'network' => 'devnet',
        ]);

    $response->assertSessionHasErrors(['wallet']);
});

it('rejects airdrop request without amount', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w',
            'network' => 'devnet',
        ]);

    $response->assertSessionHasErrors(['amount']);
});

it('accepts valid email address', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w',
            'amount' => 1.0,
            'network' => 'devnet',
            'email' => 'valid@example.com',
        ]);

    $response->assertSessionHasNoErrors(['email']);
});

it('rejects invalid email address', function () {
    $response = $this->actingAs($this->user)
        ->post(route('tools.solana-air-drop.request'), [
            'wallet' => '7cYqYGCGQaF4f7Hd3F8hJ5qK3b2p7q1n8R9s6t5u4v3w',
            'amount' => 1.0,
            'network' => 'devnet',
            'email' => 'invalid-email',
        ]);

    $response->assertSessionHasErrors(['email']);
});
