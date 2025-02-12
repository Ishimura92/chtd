<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Child extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'birth_date',
        'name_day_date',
        'avatar_url',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'name_day_date' => 'date',
    ];

    // Relacja do rodzica (User)
    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relacja do list prezentów (polimorficzna)
    public function giftLists(): MorphMany
    {
        return $this->morphMany(GiftList::class, 'owner');
    }
} 