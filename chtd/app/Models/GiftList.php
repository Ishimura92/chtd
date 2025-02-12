<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class GiftList extends Model
{
    protected $fillable = [
        'name',
        'description',
        'is_public',
        'owner_type',
        'owner_id',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    // Relacja polimorficzna do właściciela (User lub Child)
    public function owner(): MorphTo
    {
        return $this->morphTo();
    }

    // Relacja do prezentów na liście
    public function gifts(): HasMany
    {
        return $this->hasMany(Gift::class);
    }
} 