<?php

namespace Modules\Communities\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Communities\Models\CommunityMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommunityMemberController extends Controller
{
    // public function index(Request $request)
    // {

    //     $query = CommunityMember::query();


    //     if ($request->has('community_id')) {
    //         $communityId = $request->query('community_id');
    //         $query->where('community_members.community_id', $communityId);
    //     }


    //     if ($request->has('user_id')) {
    //         $userId = $request->query('user_id');
    //         $query->where('community_members.user_id', $userId);
    //     }


    //     if ($request->has('community_id')) {
    //         $communityMembers = $query
    //             ->join('profiles', 'community_members.user_id', '=', 'profiles.user_id')
    //             ->join('users', 'community_members.user_id', '=', 'users.id')
    //             ->leftJoin('employment_posts', 'community_members.user_id', '=', 'employment_posts.user_id')
    //             ->leftJoin('business_posts', 'employment_posts.business_post_id', '=', 'business_posts.id')
    //             ->select(
    //                 'community_members.*',
    //                 'profiles.bio as name',
    //                 'profiles.staff_image',
    //                 'users.is_active',
    //                 'business_posts.title as business_post_title'
    //             )
    //             ->get();

    //         return response()->json($communityMembers);
    //     } else {
    //         $communityMembers = $query->get();

    //         return response()->json($communityMembers);
    //     }
    // }

    public function index(Request $request)
    {
        $query = CommunityMember::query();

        if ($request->has('community_id')) {
            $communityId = $request->query('community_id');
            $query->where('community_members.community_id', $communityId);
        }

        if ($request->has('user_id')) {
            $userId = $request->query('user_id');
            $query->where('community_members.user_id', $userId);
        }

        if ($request->has('community_id')) {
            $communityMembers = $query
                ->join('profiles', 'community_members.user_id', '=', 'profiles.user_id')
                ->join('users', 'community_members.user_id', '=', 'users.id')
                ->leftJoin('employment_posts', 'community_members.user_id', '=', 'employment_posts.user_id')
                ->leftJoin('business_posts', 'employment_posts.business_post_id', '=', 'business_posts.id')
                ->select(
                    'community_members.*',
                    'profiles.bio as name',
                    'profiles.staff_image',
                    'users.is_active',
                    DB::raw('STRING_AGG(DISTINCT business_posts.title, \', \') as business_post_titles')
                )
                ->groupBy(
                    'community_members.id',
                    'profiles.bio',
                    'profiles.staff_image',
                    'users.is_active'
                )
                ->get();

            // attach profiles
            $communityMembers->each(function ($communityMember) {
                $communityMember->profile = $communityMember->user->profile;
            });


            return response()->json($communityMembers);
        } else {
            $communityMembers = $query->get();

            return response()->json($communityMembers);
        }
    }


    public function show($id)
    {
        return response()->json([
            'data' => CommunityMember::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...CommunityMember::rules());
        CommunityMember::create($validated);

        return response()->noContent();
    }

    public function update(CommunityMember $community_member)
    {
        $validated = request()->validate(...CommunityMember::rules('update'));
        $community_member->update($validated);

        return response()->noContent();
    }

    public function destroy(CommunityMember $community_member)
    {
        $community_member->delete();

        return response()->noContent();
    }
}
