<?php

namespace Database\Seeders;

use App\Models\AvatarTemplates;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

class AvatarTemplateSeeder extends Seeder
{

    public function run()
    {
        // Define the path to the assets folder where the images are stored
        $assetsFolder = public_path('assets');

        // Loop to create 15 templates with image upload simulation
        for ($i = 1; $i <= 15; $i++) {
            $imageFilePath = "$assetsFolder/Avatar-$i.png";
            $imageJpgFilePath = "$assetsFolder/Avatar-$i.jpg";

            if (file_exists($imageFilePath)) {
                $uploadedImagePath = $this->uploadTemplateFile($imageFilePath);

                AvatarTemplates::create([
                    'name' => "Avatar $i",
                    'background' => $uploadedImagePath,
                    'is_enabled' => true,
                ]);
            } else if (file_exists($imageJpgFilePath)) {
                $uploadedImagePath = $this->uploadTemplateFile($imageJpgFilePath, 'image/jpeg');

                AvatarTemplates::create([
                    'name' => "Avatar $i",
                    'background' => $uploadedImagePath,
                    'is_enabled' => true,
                ]);
            } else {
                echo "File not found: Avatar-$i.png\n";
            }
        }
    }

    private function uploadTemplateFile($filePath, $mimeType = 'image/png')
    {
        // Create a File instance from the path
        $uploadedFile = new UploadedFile($filePath, basename($filePath), $mimeType);

        // Use the uploadFile function to upload and get the stored path
        $uploaded = uploadFile($uploadedFile, null, 'background');

        return $uploaded['path'] ?? null;
    }

}
