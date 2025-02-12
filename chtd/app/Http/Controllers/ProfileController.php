<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . auth()->id(),
            'birth_date' => 'nullable|date',
            'name_day_date' => 'nullable|date',
            'avatar_url' => 'nullable|string'
        ]);

        $user = auth()->user();
        $user->update($validated);

        return response()->json([
            'message' => 'Profil zaktualizowany',
            'user' => $user
        ]);
    }

    public function show()
    {
        return response()->json([
            'user' => auth()->user()
        ]);
    }
} 