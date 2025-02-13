<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Present;

class PresentsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'nullable|url|max:2048',
            'image_url' => 'nullable|string|max:2048',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        $present = Present::create($request->all());

        return response()->json(['present' => $present]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'nullable|url|max:2048',
            'image_url' => 'nullable|string|max:2048',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        $present = Present::findOrFail($id);
        $present->update($request->all());

        return response()->json(['present' => $present]);
    }
} 