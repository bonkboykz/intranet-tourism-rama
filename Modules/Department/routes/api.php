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

Route::get('departments/{department}/admins', [DepartmentController::class, 'getAdmins'])->name('department.getAdmins');
Route::post('departments/{department}/invite-department-admin', [DepartmentController::class, 'inviteDepartmentAdmin'])->name('department.inviteDepartmentAdmin');
Route::post('departments/{department}/revoke-department-admin', [DepartmentController::class, 'revokeDepartmentAdmin'])->name('department.revokeDepartmentAdmin');
