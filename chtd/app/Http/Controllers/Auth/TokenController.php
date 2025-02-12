<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TokenController extends Controller
{
    public function refresh(Request $request)
    {
        // Usuń stary token
        $request->user()->currentAccessToken()->delete();
        
        // Wygeneruj nowy token
        $token = $request->user()->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'token' => $token
        ]);
    }
} 