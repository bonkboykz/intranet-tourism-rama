<?php

namespace Modules\Settings\Http\Controllers;

use App\Http\Controllers\Controller;
use Auth;
use Modules\Settings\Models\UserPreference;
use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => UserPreference::queryable()->paginate(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => UserPreference::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...UserPreference::rules());
        UserPreference::create($validated);

        return response()->noContent();
    }

    public function update(UserPreference $user_preference)
    {
        $validated = request()->validate(...UserPreference::rules('update'));
        $user_preference->update($validated);

        return response()->noContent();
    }

    public function destroy(UserPreference $user_preference)
    {
        $user_preference->delete();

        return response()->noContent();
    }

    /**
     * Update the user's theme preference.
     */
    public function updateTheme(Request $request)
    {
        $request->validate([
            'theme' => ['required', 'string'],
        ]);

        $user = Auth::user();

        // Update or create the theme preference
        UserPreference::updateOrCreate(
            [
                'user_id' => $user->id,
                'group' => 'THEME',
                'key' => 'theme',
            ],
            [
                'value' => $request->input('theme'),
            ]
        );

        return response()->noContent();
    }
}
