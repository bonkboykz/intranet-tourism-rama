<?php

use Illuminate\Support\Facades\Route;
use Modules\Resources\Http\Controllers\ResourceAccessController;
use Modules\Resources\Http\Controllers\ResourceController;

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
Route::apiResources([

    'resources' => ResourceController::class,
    'resource_access' => ResourceAccessController::class,

]);


Route::get('public-resources', [ResourceController::class, 'getPublicResources']);
