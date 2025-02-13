<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Friendship;
use App\Services\ImageService;
use Illuminate\Http\Request;

class UserController extends Controller
{
    private ImageService $imageService;
    
    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

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

    public function uploadAvatar(Request $request)
    {
        try {
            \Log::info('Rozpoczęcie przesyłania avatara', [
                'user_id' => auth()->id(),
                'request_has_file' => $request->hasFile('image'),
                'content_type' => $request->header('Content-Type')
            ]);

            $request->validate([
                'image' => [
                    'required',
                    'image',
                    'max:5120', // max 5MB (5120 = 5 * 1024)
                    'mimes:jpeg,png,jpg,gif'
                ]
            ]);

            if (!$request->hasFile('image')) {
                \Log::error('Brak pliku w żądaniu');
                return response()->json(['error' => 'Nie przesłano pliku'], 422);
            }

            $file = $request->file('image');
            \Log::info('Informacje o pliku', [
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'error' => $file->getError()
            ]);

            if (!$file->isValid()) {
                \Log::error('Plik jest nieprawidłowy', [
                    'error_code' => $file->getError()
                ]);
                return response()->json(['error' => 'Przesłany plik jest uszkodzony'], 422);
            }

            // Użyj serwisu do optymalizacji i zapisania avatara
            $path = $this->imageService->optimizeAndSave(
                $file,
                'avatars',
                'public',
                300, // mniejszy rozmiar dla avatarów
                300,
                85  // trochę wyższa jakość dla avatarów
            );
            
            \Log::info('Plik zapisany', ['path' => $path]);

            $user = auth()->user();
            $oldAvatarUrl = $user->avatar_url;
            $user->avatar_url = asset('storage/' . $path);
            $user->save();

            \Log::info('Avatar zaktualizowany', [
                'old_url' => $oldAvatarUrl,
                'new_url' => $user->avatar_url
            ]);

            return response()->json([
                'url' => $user->avatar_url
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Błąd walidacji', [
                'errors' => $e->errors()
            ]);
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Nieoczekiwany błąd przy przesyłaniu avatara', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Nie udało się przesłać avatara: ' . $e->getMessage()], 500);
        }
    }
} 