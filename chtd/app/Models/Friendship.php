<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Friendship extends Model
{
    protected $fillable = [
        'user_id_1',
        'user_id_2',
        'status'
    ];

    protected $casts = [
        'status' => 'string',
    ];

    // Relacja do pierwszego użytkownika
    public function userOne(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_1');
    }

    // Relacja do drugiego użytkownika
    public function userTwo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_2');
    }
} 