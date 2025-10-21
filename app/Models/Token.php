<?php

namespace App\Models;

use Database\Factories\TokenFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Token extends Model
{
    /** @use HasFactory<TokenFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'symbol',
        'description',
        'supply',
        'decimals',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
