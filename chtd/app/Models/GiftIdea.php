<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GiftIdea extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'url',
        'image_url',
        'price',
        'description',
        'recipient_type',
        'recipient_user_id',
        'recipient_custom',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'recipient_type' => 'string',
    ];

    // Relacja do użytkownika, który dodał pomysł
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relacja do użytkownika, który jest odbiorcą (jeśli recipient_type = 'USER')
    public function recipientUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_user_id');
    }
}
