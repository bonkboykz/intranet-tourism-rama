<?php

namespace App\Http\Controllers;

use App\Models\AvatarTemplates;
use Illuminate\Http\Request;

class AvatarTemplateController extends Controller
{
    public function index()
    {
        $data = AvatarTemplates::query()->orderBy('id', 'asc')->get();

        return response()->json([
            'data' => $data
        ]);
    }
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'background' => 'nullable|image',
            'is_enabled' => 'required|boolean',
        ]);

        // Handle file upload
        if ($request->hasFile('background')) {
            $imagePath = uploadFile($request->file('background'), null, 'background')['path'];
            $validated['background'] = $imagePath;
        }

        // Store data
        AvatarTemplates::create($validated);

        return response()->json(['message' => 'Birthday template created successfully!']);
    }

    public function update(Request $request, AvatarTemplates $avatarTemplate)
    {
        // Validate request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'background' => 'nullable|image',
            'is_enabled' => 'required|boolean',
        ]);

        // Handle file upload
        if ($request->hasFile('background')) {
            $imagePath = uploadFile($request->file('background'), null, 'background')['path'];
            $validated['background'] = $imagePath;
        }

        // Update data
        $avatarTemplate->update($validated);

        return response()->json(['message' => '$avatarTemplate template updated successfully!']);
    }

    public function destroy(AvatarTemplates $avatarTemplate)
    {
        $avatarTemplate->delete();
        return response()->json(['message' => '$avatarTemplate template deleted successfully!']);
    }

    public function toggleEnabled(AvatarTemplates $avatarTemplate)
    {
        $avatarTemplate->update([
            'is_enabled' => !$avatarTemplate->is_enabled,
        ]);

        return response()->json(['message' => '$avatarTemplate template updated successfully!']);
    }

}
