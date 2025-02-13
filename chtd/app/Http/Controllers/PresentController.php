<?php

namespace App\Http\Controllers;

use App\Models\Present;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PresentController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $userId = $request->query('user_id', auth()->id());
        
        $targetUser = User::findOrFail($userId);
        $this->authorize('viewAny', [Present::class, $targetUser]);
        
        $presents = Present::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json(['presents' => $presents]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'image_url' => 'nullable|url|max:255',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        $present = auth()->user()->presents()->create($validated);
        return response()->json(['present' => $present], 201);
    }

    public function update(Request $request, Present $present)
    {
        $this->authorize('update', $present);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'image_url' => 'nullable|url|max:255',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        $present->update($validated);
        return response()->json(['present' => $present]);
    }

    public function destroy(Present $present)
    {
        $this->authorize('delete', $present);
        $present->delete();
        return response()->json(['message' => 'Present deleted']);
    }

    public function fetchMetadata(Request $request)
    {
        $url = $request->validate(['url' => 'required|url'])['url'];
        
        try {
            $response = Http::get($url);
            $html = $response->body();
            
            // Podstawowe parsowanie meta tagów
            preg_match('/<title>(.*?)<\/title>/i', $html, $titleMatch);
            preg_match('/<meta property="og:image" content="(.*?)"/i', $html, $imageMatch);
            preg_match('/<meta property="og:description" content="(.*?)"/i', $html, $descMatch);
            
            return response()->json([
                'title' => $titleMatch[1] ?? '',
                'image_url' => $imageMatch[1] ?? '',
                'description' => $descMatch[1] ?? ''
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not fetch metadata'], 422);
        }
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048', // max 2MB
        ]);

        $path = $request->file('image')->store('presents', 'public');
        
        return response()->json([
            'url' => asset('storage/' . $path)
        ]);
    }
} 