<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // max 2MB
        ]);

        $path = $request->file('image')->store('gift-images', 'public');
        
        return response()->json([
            'url' => Storage::url($path)
        ]);
    }
} 