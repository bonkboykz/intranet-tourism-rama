<?php

use Illuminate\Support\Facades\Route;
use Modules\Crud\Http\Controllers\CrudController;
use Modules\Crud\Http\Controllers\PostController;
use Modules\Events\Http\Controllers\EventAttendanceController;
use Modules\Events\Http\Controllers\EventController;
use Modules\Events\Http\Controllers\TaskController;
use Modules\Events\Http\Controllers\TaskItemController;

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
Route::post('events/{event}/invite', [EventController::class, 'invite'])->middleware('auth:sanctum');
Route::apiResources([

    'events' => EventController::class,
    'event_attendance' => EventAttendanceController::class,
    'tasks' => TaskController::class,
    'task_items' => TaskItemController::class,

], [
    'middleware' => 'auth:sanctum'
]);

Route::get('get-upcoming-events', [EventController::class, 'getUpcomingEvents'])->middleware('auth:sanctum');
Route::get('generate-pdf', [EventController::class, 'generatePdf'])->middleware('auth:sanctum');
