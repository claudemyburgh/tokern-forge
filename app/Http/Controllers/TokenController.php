<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTokenRequest;
use App\Http\Requests\UpdateTokenRequest;
use App\Models\Token;
use Inertia\Inertia;

class TokenController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('token/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTokenRequest $request)
    {
        $validated = $request->validated();

        // Create token with basic data
        $token = auth()->user()->tokens()->create([
            'name' => $validated['name'],
            'symbol' => $validated['symbol'],
            'decimal' => $validated['decimal'],
            'supply' => $validated['supply'],
            'description' => $validated['description'],
            'website' => $validated['website'] ?? null,
            'twitter_url' => $validated['twitter'] ?? null,
            'telegram_url' => $validated['telegram'] ?? null,
            'discord_url' => $validated['discord'] ?? null,
            'reddit_url' => null, // Not in form yet
            'wallet_address' => $validated['wallet_address'] ?? null,
            'is_frozen' => false, // Always false for new tokens
            'is_mint_revoked' => $validated['revoke_mint'] ?? false,
            'status' => $validated['action'] === 'create' ? 'pending' : 'draft',
            'network' => 'devnet', // Default to devnet
        ]);

        // Handle image upload with Spatie Media Library
        if ($request->hasFile('image')) {
            $token->addMediaFromRequest('image')
                ->toMediaCollection('meme');
        }

        // If action is 'create', you would trigger blockchain deployment here
        // For now, we'll just save as draft or pending

        return redirect()->route('tokens.show', $token)->with('success', 'Token created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Token $token)
    {
        // Ensure user can only view their own tokens
        if ($token->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('token/show', [
            'token' => $token->load('media'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Token $token)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTokenRequest $request, Token $token)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Token $token)
    {
        //
    }
}
