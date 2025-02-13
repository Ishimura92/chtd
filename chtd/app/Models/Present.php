<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Present extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'url',
        'image_url',
        'price',
        'description'
    ];

    protected $casts = [
        'price' => 'decimal:2'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 