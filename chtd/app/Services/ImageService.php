<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageService
{
    private ImageManager $manager;
    
    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }
    
    public function optimizeAndSave(UploadedFile $file, string $path, string $disk = 'public', int $maxWidth = 500, int $maxHeight = 500, int $quality = 80): string
    {
        // Wczytaj obraz
        $image = $this->manager->read($file);
        
        // Zachowaj proporcje i zmniejsz obraz jeśli jest większy niż maksymalne wymiary
        $image->scaleDown($maxWidth, $maxHeight);
        
        // Generuj unikalną nazwę pliku
        $filename = uniqid() . '.' . $file->getClientOriginalExtension();
        $fullPath = $path . '/' . $filename;
        
        // Zapisz zoptymalizowany obraz
        $image->toJpeg($quality)->save(storage_path('app/public/' . $fullPath));
        
        return $fullPath;
    }
} 