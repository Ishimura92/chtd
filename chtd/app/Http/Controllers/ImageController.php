<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Sprawdź typ uploadu (avatar czy zdjęcie prezentu)
            $uploadType = $request->input('type', 'present');
            $directory = $uploadType === 'avatar' ? 'public/avatars' : 'public/presents';
            
            // Upewnij się, że katalog istnieje
            if (!Storage::exists($directory)) {
                Storage::makeDirectory($directory);
            }

            if (!$request->hasFile('image')) {
                return response()->json([
                    'message' => 'Nie znaleziono pliku w żądaniu',
                    'debug' => [
                        'has_file' => $request->hasFile('image'),
                        'files' => $request->allFiles(),
                        'content_type' => $request->header('Content-Type')
                    ]
                ], 422);
            }

            $file = $request->file('image');
            if (!$file->isValid()) {
                return response()->json([
                    'message' => 'Nieprawidłowy plik',
                    'debug' => [
                        'error' => $file->getError(),
                        'error_message' => $file->getErrorMessage()
                    ]
                ], 422);
            }

            $originalName = $file->getClientOriginalName();
            \Log::info('Original file name: ' . $originalName);

            // Generuj unikalną nazwę pliku
            $extension = $file->getClientOriginalExtension();
            $fileName = uniqid() . '_' . time() . '.' . $extension;
            
            $path = $file->storeAs($directory, $fileName);
            $url = Storage::url($path);

            \Log::info('Image uploaded successfully. Path: ' . $path . ', URL: ' . $url);
            \Log::info('Full storage path: ' . Storage::path($path));
            \Log::info('Public path: ' . public_path($url));

            return response()->json([
                'url' => $url
            ]);
        } catch (\Exception $e) {
            \Log::error('Image upload error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            \Log::error('Request details: ' . json_encode($request->all()));
            return response()->json([
                'message' => 'Nie udało się zapisać obrazu',
                'error' => $e->getMessage()
            ], 422);
        }
    }
} 