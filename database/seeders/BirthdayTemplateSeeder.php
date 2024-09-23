<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BirthdayTemplate;
use Illuminate\Http\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class BirthdayTemplateSeeder extends Seeder
{
    public function run()
    {
        // Define the path to the assets folder where the images are stored
        $assetsFolder = public_path('assets');

        // Loop to create 12 templates with image upload simulation
        for ($i = 1; $i <= 12; $i++) {
            $imageFilePath = "$assetsFolder/Birthday-Template-$i.png";
            $imageJpgFilePath = "$assetsFolder/Birthday-Template-$i.jpg";

            if (file_exists($imageFilePath)) {
                $uploadedImagePath = $this->uploadTemplateFile($imageFilePath);

                BirthdayTemplate::create([
                    'name' => "Birthday Template $i",
                    'background' => $uploadedImagePath,
                    'is_enabled' => true,
                ]);
            } else if (file_exists($imageJpgFilePath)) {
                $uploadedImagePath = $this->uploadTemplateFile($imageJpgFilePath, 'image/jpeg');

                BirthdayTemplate::create([
                    'name' => "Birthday Template $i",
                    'background' => $uploadedImagePath,
                    'is_enabled' => true,
                ]);
            } else {
                echo "File not found: Birthday-Template-$i.png\n";
            }
        }
    }

    /**
     * Simulate the file upload process using the uploadFile function.
     *
     * @param string $filePath
     * @return string
     */
    private function uploadTemplateFile($filePath, $mimeType = 'image/png')
    {
        // Create a File instance from the path
        $uploadedFile = new UploadedFile($filePath, basename($filePath), $mimeType);

        // Use the uploadFile function to upload and get the stored path
        $uploaded = uploadFile($uploadedFile, null, 'background');

        return $uploaded['path'] ?? null;
    }
}
