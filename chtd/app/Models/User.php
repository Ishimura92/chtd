<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'email',
        'password',
        'name',
        'surname',
        'birth_date',
        'name_day_date',
        'avatar_url',
        'google_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'name_day_date' => 'date',
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relacja do dzieci
    public function children(): HasMany
    {
        return $this->hasMany(Child::class);
    }

    // Relacja do list prezentów (polimorficzna)
    public function giftLists(): MorphMany
    {
        return $this->morphMany(GiftList::class, 'owner');
    }

    // Relacja do rezerwacji prezentów
    public function giftReservations(): HasMany
    {
        return $this->hasMany(GiftReservation::class);
    }

    // Relacja do powiadomień
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    // Relacje do znajomych (jako user1)
    public function friendshipsAsUser1(): HasMany
    {
        return $this->hasMany(Friendship::class, 'user_id_1');
    }

    // Relacje do znajomych (jako user2)
    public function friendshipsAsUser2(): HasMany
    {
        return $this->hasMany(Friendship::class, 'user_id_2');
    }

    // Wszystkie znajomości (jako user1 lub user2)
    public function friendships(): HasMany
    {
        return $this->hasMany(Friendship::class, 'user_id_1')
            ->orWhere('user_id_2', $this->id);
    }

    public function hasReceivedFriendRequestFrom(User $user): bool
    {
        return $this->friendshipRequestsReceived()
            ->where('user_id_1', $user->id)
            ->where('status', 'pending')
            ->exists();
    }

    public function friendshipRequestsReceived(): HasMany
    {
        return $this->hasMany(Friendship::class, 'user_id_2')
            ->where('status', 'pending');
    }

    public function presents(): HasMany
    {
        return $this->hasMany(Present::class);
    }

    public function giftIdeas(): HasMany
    {
        return $this->hasMany(GiftIdea::class);
    }
} 