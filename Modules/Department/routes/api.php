<?php

use Illuminate\Support\Facades\Route;
use Modules\Department\Http\Controllers\BusinessGradeController;
use Modules\Department\Http\Controllers\BusinessPostController;
use Modules\Department\Http\Controllers\BusinessSchemeController;
use Modules\Department\Http\Controllers\BusinessUnitController;
use Modules\Department\Http\Controllers\DepartmentController;
use Modules\Department\Http\Controllers\EmploymentPostController;
use Modules\Department\Http\Controllers\SupervisorController;

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
    'business_grades' => BusinessGradeController::class,
    'business_posts' => BusinessPostController::class,
    'business_schemes' => BusinessSchemeController::class,
    'business_units' => BusinessUnitController::class,
    'departments' => DepartmentController::class,
    'employment_posts' => EmploymentPostController::class,
    'supervisors' => SupervisorController::class,
]);

Route::post('departments/{department}/invite-community-admin', [DepartmentController::class, 'inviteCommunityAdmin'])->name('community.inviteCommunityAdmin');
Route::post('departments/{department}/revoke-community-admin', [DepartmentController::class, 'revokeCommunityAdmin'])->name('community.revokeCommunityAdmin');
Route::get('departments/{department}/admins', [DepartmentController::class, 'getAdmins'])->name('community.getAdmins');
