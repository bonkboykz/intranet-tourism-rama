<?php

namespace Modules\Communities\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Auth;
use Modules\Communities\Models\Community;
use Modules\Communities\Models\CommunityMember;

class CommunityController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Community::queryable()->paginate(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => Community::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {

        $validated = request()->validate(...Community::rules());
        $new_community = Community::create($validated);

        CommunityMember::create([
            'user_id' => Auth::id(),
            'community_id' => $new_community['id'],
            'role' => 'admin',
        ]);

        return response()->noContent();
    }

    public function update(Community $community)
    {
        $validated = request()->validate(...Community::rules('update'));
        $community->update($validated);

        return response()->noContent();
    }

    public function destroy(Community $community)
    {
        $community->delete();

        return response()->noContent();
    }

    public function addMember(Community $community)
    {

        request()->validate(Community::rules('addMember'));
        $user = User::findOrFail(request()->user_id);

        if (request()->has('role')) {

            $role = request('role');
            $community->members()->attach($user, ['role' => $role]);

        } else {
            $community->members()->attach($user);
        }

        return response()->noContent();
    }

    public function deleteMember(Community $community)
    {

        request()->validate(Community::rules('addMember'));

        $user = User::findOrFail(request()->user_id);

        $community->members()->detach($user->id);

        return response()->noContent();
    }
}
