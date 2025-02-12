<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Friendship;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q');
        
        $users = User::where('id', '!=', auth()->id())
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('surname', 'like', "%{$query}%");
            })
            ->select('id', 'name', 'surname', 'avatar_url')
            ->limit(10)
            ->get()
            ->map(function($user) {
                $friendship = Friendship::where(function($q) use ($user) {
                    $q->where('user_id_1', auth()->id())
                      ->where('user_id_2', $user->id);
                })->orWhere(function($q) use ($user) {
                    $q->where('user_id_1', $user->id)
                      ->where('user_id_2', auth()->id());
                })->first();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'avatar' => $user->avatar_url,
                    'friendshipStatus' => $friendship ? [
                        'status' => $friendship->status,
                        'isReceived' => $friendship->user_id_1 === $user->id
                    ] : null
                ];
            });

        return response()->json(['data' => $users]);
    }
} 