<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GiftReservation extends Model
{
    protected $fillable = [
        'gift_id',
        'user_id',
    ];

    // Relacja do prezentu
    public function gift(): BelongsTo
    {
        return $this->belongsTo(Gift::class);
    }

    // Relacja do użytkownika, który zarezerwował prezent
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 