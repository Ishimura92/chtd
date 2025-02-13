<?php

namespace App\Policies;

use App\Models\Present;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PresentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user, User $targetUser)
    {
        // Jeśli to nasze własne prezenty
        if ($user->id === $targetUser->id) {
            return true;
        }

        // Sprawdź czy jesteśmy znajomymi
        return $user->friendships()
            ->where(function($query) use ($user, $targetUser) {
                $query->where([
                    ['user_id_1', '=', $user->id],
                    ['user_id_2', '=', $targetUser->id]
                ])->orWhere([
                    ['user_id_1', '=', $targetUser->id],
                    ['user_id_2', '=', $user->id]
                ]);
            })
            ->where('status', 'accepted')
            ->exists();
    }

    public function update(User $user, Present $present): bool
    {
        return $user->id === $present->user_id;
    }

    public function delete(User $user, Present $present): bool
    {
        return $user->id === $present->user_id;
    }
} 