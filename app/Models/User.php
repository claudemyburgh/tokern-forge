<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Observers\UserObserver;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Image\Enums\Fit;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Permission\Traits\HasRoles;


#[ObservedBy(UserObserver::class)]
class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, InteractsWithMedia, SoftDeletes, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
    ];

    protected $appends = ['avatar', 'avatar_small', 'initials', 'is_super_admin'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];


    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super-admin');
    }

    public function GetIsSuperAdminAttribute(): bool
    {
        return $this->isSuperAdmin();
    }



    public function getInitialsAttribute(): string
    {
        return Str::getInitials($this->name);
    }

    public function getAvatarAttribute(): string
    {
        if ($this->hasMedia('avatar')) {
            return $this->getFirstMediaUrl('avatar', '320x320');
        }

        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=random&size=320';
    }

    public function getAvatarSmallAttribute(): string
    {
        return $this->getAvatarUrl('80x80');
    }

    /**
     * Get avatar URL for specific size
     */
    public function getAvatarUrl(string $conversion = '320x320'): string
    {
        if ($this->hasMedia('avatar')) {
            return $this->getFirstMediaUrl('avatar', $conversion);
        }

        // Extract size from conversion name (e.g., '80x80' -> '80')
        $size = explode('x', $conversion)[0];

        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=random&size=' . $size;
    }

    public function registerMediaCollections(): void
    {
        $this
            ->addMediaCollection('avatar')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('80x80')
            ->fit(Fit::Crop, 80, 80)
            ->sharpen(10)
            ->quality(90)
            ->optimize()
            ->nonQueued();

        $this->addMediaConversion('160x160')
            ->fit(Fit::Crop, 160, 160)
            ->sharpen(10)
            ->quality(90)
            ->optimize()
            ->nonQueued();

        // Main preview size with center crop
        $this->addMediaConversion('320x320')
            ->fit(Fit::Crop, 320, 320)
            ->sharpen(10)
            ->quality(95)
            ->optimize()
            ->nonQueued();
    }


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
