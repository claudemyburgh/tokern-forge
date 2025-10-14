<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Token extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        // On-chain metadata
        'name',
        'symbol',
        'decimal',
        'supply',
        'mint_address',
        'metadata_uri',
        'network',

        // Off-chain metadata
        'description',
        'website',
        'twitter_url',
        'telegram_url',
        'discord_url',
        'reddit_url',

        // Internal platform data
        'user_id',
        'wallet_address',
        'is_frozen',
        'is_mint_revoked',
        'status',
    ];

    protected $casts = [
        'is_frozen' => 'boolean',
        'is_mint_revoked' => 'boolean',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('meme')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        // Blockchain metadata image (64x64)
        $this->addMediaConversion('blockchain')
            ->fit(Fit::Crop, 64, 64)
            ->sharpen(10)
            ->quality(95)
            ->optimize()
            ->nonQueued();

        // Icon sizes for UI
        $this->addMediaConversion('icon-32')
            ->fit(Fit::Crop, 32, 32)
            ->sharpen(10)
            ->quality(90)
            ->optimize()
            ->nonQueued();

        $this->addMediaConversion('icon-80')
            ->fit(Fit::Crop, 80, 80)
            ->sharpen(10)
            ->quality(90)
            ->optimize()
            ->nonQueued();

        $this->addMediaConversion('icon-160')
            ->fit(Fit::Crop, 160, 160)
            ->sharpen(10)
            ->quality(90)
            ->optimize()
            ->nonQueued();

        // Website preview (larger size for better display)
        $this->addMediaConversion('preview')
            ->fit(Fit::Crop, 512, 512)
            ->sharpen(10)
            ->quality(95)
            ->optimize()
            ->nonQueued();
    }

}
