<?php

use Illuminate\Support\Facades\Route;

use Modules\Settings\Http\Controllers\CommunityPreferenceController;
use Modules\Settings\Http\Controllers\DepartmentPreferenceController;
use Modules\Settings\Http\Controllers\ExternalLinkController as ControllersExternalLinkController;
use Modules\Settings\Http\Controllers\PreferenceSchemaController;
use Modules\Settings\Http\Controllers\SettingController;
use Modules\Settings\Http\Controllers\UserPreferenceController;


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

// require_once 'crud.php';
Route::get('/search', [SettingController::class, 'search'])->name('search');

Route::apiResources([

    'community_preferences' => CommunityPreferenceController::class,
    'department_preferences' => DepartmentPreferenceController::class,
    'external_links' => ControllersExternalLinkController::class,
    'preference_schemas' => PreferenceSchemaController::class,
    'settings' => SettingController::class,
    'user_preferences' => UserPreferenceController::class,
]);

Route::put('/user-preferences/theme', [UserPreferenceController::class, 'updateTheme'])->name('user-preferences.updateTheme');
Route::put('/settings/update_by_key/{key}', [SettingController::class, 'updateByKey'])->name('settings.updateByKey');

