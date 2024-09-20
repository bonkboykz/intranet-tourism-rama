<?php

use Illuminate\Support\Facades\Route;
use Modules\Crud\Http\Controllers\CrudController;
use Modules\Crud\Http\Controllers\PostController;
use Modules\Profile\Http\Controllers\InvitationController;
use Modules\Profile\Http\Controllers\ProfileController;

// use Modules\Profile\Models\Invitation;
// use Modules\Profile\Models\Profile;

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

// Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
//     Route::apiResource('crud', CrudController::class)->names('crud');
// });

Route::group(['middleware' => ['auth:api']], function () {
    Route::apiResources([

        'profiles' => ProfileController::class,
        'invitations' => InvitationController::class,

    ]);
});

// require_once 'crud.php';
Route::get('user/{id}/profile-qr', [ProfileController::class, 'profileQr'])->name('profileQr');
Route::get('get_all_birthdays', [ProfileController::class, 'getAllBirthdays'])->name('getAllBirthdays');
Route::put('profiles/{profile}/update_profile_image', [ProfileController::class, 'updateProfileImage'])->name('updateProfileImage');
Route::put('profiles/{profile}/update_profile_cover', [ProfileController::class, 'updateProfileCover'])->name('updateProfileCover');
