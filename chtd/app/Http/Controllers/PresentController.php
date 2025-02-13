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
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'url' => 'required|url|max:255',
                'image_url' => 'nullable|url|max:255',
                'price' => 'nullable|numeric|min:0',
                'description' => 'nullable|string'
            ]);

            $present = auth()->user()->presents()->create($validated);
            return response()->json(['present' => $present], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Nie udało się utworzyć prezentu'], 500);
        }
    }

    public function update(Request $request, Present $present)
    {
        try {
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
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json(['error' => 'Brak uprawnień do edycji tego prezentu'], 403);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Nie udało się zaktualizować prezentu'], 500);
        }
    }

    public function destroy(Present $present)
    {
        $this->authorize('delete', $present);
        $present->delete();
        return response()->json(['message' => 'Present deleted']);
    }

    public function fetchMetadata(Request $request)
    {
        try {
            $url = $request->validate(['url' => 'required|url'])['url'];
            
            $response = Http::timeout(5)->get($url);
            
            if (!$response->successful()) {
                return response()->json(['error' => 'Nie udało się pobrać danych ze strony'], 422);
            }
            
            $html = $response->body();
            
            // Podstawowe parsowanie meta tagów
            preg_match('/<title>(.*?)<\/title>/i', $html, $titleMatch);
            preg_match('/<meta property="og:image" content="(.*?)"/i', $html, $imageMatch);
            preg_match('/<meta property="og:description" content="(.*?)"/i', $html, $descMatch);
            
            // Dodatkowe sprawdzenie dla obrazka
            if (empty($imageMatch[1])) {
                preg_match('/<meta name="twitter:image" content="(.*?)"/i', $html, $imageMatch);
            }
            
            // Dodatkowe sprawdzenie dla opisu
            if (empty($descMatch[1])) {
                preg_match('/<meta name="description" content="(.*?)"/i', $html, $descMatch);
            }
            
            return response()->json([
                'title' => $titleMatch[1] ?? '',
                'image_url' => $imageMatch[1] ?? '',
                'description' => $descMatch[1] ?? ''
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Nie udało się pobrać metadanych'], 422);
        }
    }

    public function uploadImage(Request $request)
    {
        try {
            $request->validate([
                'image' => [
                    'required',
                    'image',
                    'max:2048', // max 2MB
                    'mimes:jpeg,png,jpg,gif'
                ]
            ]);

            if (!$request->file('image')->isValid()) {
                return response()->json(['error' => 'Przesłany plik jest uszkodzony'], 422);
            }

            $path = $request->file('image')->store('presents', 'public');
            
            if (!$path) {
                return response()->json(['error' => 'Nie udało się zapisać pliku'], 500);
            }

            return response()->json([
                'url' => asset('storage/' . $path)
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Nie udało się przesłać obrazka'], 500);
        }
    }
} 