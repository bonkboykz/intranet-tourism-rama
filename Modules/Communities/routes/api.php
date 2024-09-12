<?php

use Illuminate\Support\Facades\Route;
use Modules\Communities\Http\Controllers\CommunityController;
use Modules\Communities\Http\Controllers\CommunityMemberController;

/*
 *--------------------------------------------------------------------------
 * API Routes
 *--------------------------------------------------------------------------
 *
 * Here is where you can register API routes for your application. These
 * routes are loaded by the RouteServiceProvider within a group which
 * is assigned the "api" middleware group. Enjoy building your API!
 *
 */



Route::apiResources([
    'communities' => CommunityController::class,
    'community_members' => CommunityMemberController::class,
]);

Route::post('communities/{community}/add-member', [CommunityController::class, 'addMember'])->name('community.addMember');
Route::post('communities/{community}/delete-member', [CommunityController::class, 'deleteMember'])->name('community.deleteMember');
Route::post('communities/{community}/invite-community-admin', [CommunityController::class, 'inviteCommunityAdmin'])->name('community.inviteCommunityAdmin');
Route::post('communities/{community}/revoke-community-admin', [CommunityController::class, 'revokeCommunityAdmin'])->name('community.revokeCommunityAdmin');
Route::get('communities/{community}/admins', [CommunityController::class, 'getAdmins'])->name('community.getAdmins');
