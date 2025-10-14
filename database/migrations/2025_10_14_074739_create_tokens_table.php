<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tokens', function (Blueprint $table) {

            $table->id();
            // On-chain
            $table->string('name');
            $table->string('symbol');
            $table->unsignedTinyInteger('decimal')->default(9);
            $table->unsignedBigInteger('supply');
            $table->string('mint_address')->nullable();
            $table->string('metadata_uri')->nullable();
            $table->string('network')->default('devnet');

            // Off-chain
            $table->text('description')->nullable();
            $table->string('website')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('telegram_url')->nullable();
            $table->string('discord_url')->nullable();
            $table->string('reddit_url')->nullable();

            // Platform
            $table->string('wallet_address')->nullable();
            $table->boolean('is_frozen')->default(false);
            $table->boolean('is_mint_revoked')->default(false);
            $table->string('status')->default('draft');

            $table->foreignIdFor(\App\Models\User::class);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tokens');
    }
};
