<?php

use Illuminate\Support\Facades\Route;
// use Modules\Crud\Http\Controllers\UserController;
use Modules\Department\Http\Controllers\BusinessGradeController;
use Modules\Department\Http\Controllers\BusinessPostController;
use Modules\Department\Http\Controllers\BusinessSchemeController;
use Modules\Department\Http\Controllers\BusinessUnitController;
use Modules\Department\Http\Controllers\DepartmentController;
use Modules\Department\Http\Controllers\EmploymentPostController;
use Modules\Department\Http\Controllers\SupervisorController;
use Modules\User\Http\Controllers\BirthdayReminderController;
use Modules\User\Http\Controllers\UserController;

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
    'users' => UserController::class,
    'birthday_reminders' => BirthdayReminderController::class,
]);
