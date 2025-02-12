<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use Illuminate\Http\Request;

class FriendRequestController extends Controller
{
    public function index()
    {
        $requests = Friendship::where('user_id_2', auth()->id())
            ->where('status', 'pending')
            ->with('userOne:id,name,surname,email,avatar')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'name' => $request->userOne->name . ' ' . $request->userOne->surname,
                    'email' => $request->userOne->email,
                    'avatar' => $request->userOne->avatar
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

        $request->status = 'rejected';
        $request->save();

        return response()->json(['message' => 'Zaproszenie odrzucone']);
    }
} 