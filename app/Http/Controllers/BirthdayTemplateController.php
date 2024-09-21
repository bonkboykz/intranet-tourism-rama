<?php

namespace App\Http\Controllers;

use App\Models\BirthdayTemplate;
use Illuminate\Http\Request;

class BirthdayTemplateController extends Controller
{
    public function index()
    {
        $data = BirthdayTemplate::query()->orderBy('id', 'asc')->get();

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
        BirthdayTemplate::create($validated);

        return response()->json(['message' => 'Birthday template created successfully!']);
    }

    public function update(Request $request, BirthdayTemplate $birthdayTemplate)
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
        $birthdayTemplate->update($validated);

        return response()->json(['message' => 'Birthday template updated successfully!']);
    }

    public function toggleEnabled(BirthdayTemplate $birthdayTemplate)
    {
        $birthdayTemplate->update([
            'is_enabled' => !$birthdayTemplate->is_enabled,
        ]);

        return response()->json(['message' => 'Birthday template updated successfully!']);
    }
}
