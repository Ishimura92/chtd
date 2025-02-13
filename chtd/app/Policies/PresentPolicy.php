<?php

namespace App\Policies;

use App\Models\Present;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PresentPolicy
{
    use HandlesAuthorization;

    public function update(User $user, Present $present): bool
    {
        return $user->id === $present->user_id;
    }

    public function delete(User $user, Present $present): bool
    {
        return $user->id === $present->user_id;
    }
} 