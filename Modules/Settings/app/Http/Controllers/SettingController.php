<?php

namespace Modules\Settings\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Posts\Models\Post;
use Modules\Resources\Models\Resource;
use Modules\Settings\Models\Setting;
use Illuminate\Support\Str;
use Modules\Communities\Models\Community;
use Modules\Crud\Models\User;
use Modules\Department\Models\Department;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');

        // attach app url to logo
        // $settings['logo'] = config('app.url') . $settings['logo'];

        return response()->json([
            'data' => $settings,
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => Setting::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...Setting::rules());
        Setting::create($validated);

        return response()->noContent();
    }

    public function update(Setting $setting)
    {
        $validated = request()->validate(...Setting::rules('update'));
        $setting->update($validated);

        return response()->noContent();
    }

    public function updateByKey(Request $request, string $key)
    {
        $setting = Setting::where('key', $key)->first();

        $value = $request->value;


        $setting->update(['value' => $value]);
        $setting->save();

        return response()->noContent();
    }

    public function destroy(Setting $setting)
    {
        $setting->delete();

        return response()->noContent();
    }

    public function search(Request $request)
    {

        if ($request->has('search') && Str::startsWith($request->input('search'), '#')) {

            $tag = $request->input('search');
            $posts = Post::whereJsonContains('tag', $tag)->get();

            return response()->json($posts);
        } else {
            $departments = [];
            $users = [];
            $communities = [];

            if ($request->has('search')) {
                $departments = Department::where('name', 'like', '%' . $request->input('search') . '%')->get();
                $users = User::where('name', 'like', '%' . $request->input('search') . '%')->get();
                $communities = Community::where('name', 'like', '%' . $request->input('search') . '%')->get();
            }

            $response = [
                'departments' => $departments,
                'users' => $users,
                'communities' => $communities,
            ];

            return response()->json($response);
        }
    }
}
