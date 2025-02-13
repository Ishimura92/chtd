<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;

class FriendshipController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        // Sprawdź czy zaproszenie już nie istnieje
        $existingFriendship = Friendship::where(function($query) use ($request) {
            $query->where('user_id_1', auth()->id())
                ->where('user_id_2', $request->user_id);
        })->orWhere(function($query) use ($request) {
            $query->where('user_id_1', $request->user_id)
                ->where('user_id_2', auth()->id());
        })->first();

        if ($existingFriendship) {
            return response()->json([
                'message' => 'Zaproszenie już istnieje lub jesteście już znajomymi'
            ], 422);
        }

        // Utwórz nowe zaproszenie
        Friendship::create([
            'user_id_1' => auth()->id(),
            'user_id_2' => $request->user_id,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Zaproszenie zostało wysłane'
        ]);
    }

    public function index()
    {
        $friends = Friendship::where(function($query) {
            $query->where('user_id_1', auth()->id())
                ->orWhere('user_id_2', auth()->id());
        })
        ->where('status', 'accepted')
        ->get()
        ->map(function($friendship) {
            // Pobierz drugiego użytkownika (nie zalogowanego)
            $friend = $friendship->user_id_1 === auth()->id() 
                ? $friendship->userTwo 
                : $friendship->userOne;

            return [
                'id' => $friend->id,
                'name' => $friend->name,
                'surname' => $friend->surname,
                'avatar_url' => $friend->avatar_url,
                'birth_date' => $friend->birth_date,
                'name_day_date' => $friend->name_day_date
            ];
        });

        return response()->json(['data' => $friends]);
    }

    public function getPendingRequests()
    {
        $requests = Friendship::where('user_id_2', auth()->id())
            ->where('status', 'pending')
            ->with('userOne:id,name,surname,email,avatar_url')
            ->get()
            ->map(function($request) {
                return [
                    'id' => $request->id,
                    'name' => $request->userOne->name . ' ' . $request->userOne->surname,
                    'email' => $request->userOne->email,
                    'avatar' => $request->userOne->avatar_url
                ];
            });

        return response()->json(['data' => $requests]);
    }

    public function accept($id)
    {
        $request = Friendship::where('id', $id)
            ->where('user_id_2', auth()->id())
            ->where('status', 'pending')
            ->firstOrFail();

        $request->status = 'accepted';
        $request->save();

        return response()->json(['message' => 'Zaproszenie zaakceptowane']);
    }

    public function reject($id)
    {
        $request = Friendship::where('id', $id)
            ->where('user_id_2', auth()->id())
            ->where('status', 'pending')
            ->firstOrFail();

        $request->delete();

        return response()->json(['message' => 'Zaproszenie odrzucone']);
    }

    public function destroy($id)
    {
        $friendship = Friendship::where(function($query) use ($id) {
            $query->where('user_id_1', auth()->id())
                ->where('user_id_2', $id);
        })->orWhere(function($query) use ($id) {
            $query->where('user_id_1', $id)
                ->where('user_id_2', auth()->id());
        })->firstOrFail();

        $friendship->delete();

        return response()->json(['message' => 'Znajomy został usunięty']);
    }

    public function searchUsers(Request $request)
    {
        $query = $request->get('query');
        
        $users = User::where('id', '!=', auth()->id())
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('surname', 'like', "%{$query}%");
            })
            ->select(['id', 'name', 'surname', 'avatar_url'])
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'avatar_url' => $user->avatar_url,
                    'friendshipStatus' => $this->getFriendshipStatus($user->id)
                ];
            });
        
        return response()->json($users);
    }
} 