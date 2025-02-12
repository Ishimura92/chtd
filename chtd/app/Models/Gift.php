<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Gift extends Model
{
    protected $fillable = [
        'gift_list_id',
        'name',
        'description',
        'url',
        'image_url',
        'estimated_price',
        'metadata',
    ];

    protected $casts = [
        'estimated_price' => 'decimal:2',
        'metadata' => 'json',
    ];

    // Relacja do listy prezentów
    public function giftList(): BelongsTo
    {
        return $this->belongsTo(GiftList::class);
    }

    // Relacja do rezerwacji
    public function reservation(): HasOne
    {
        return $this->hasOne(GiftReservation::class);
    }
} 