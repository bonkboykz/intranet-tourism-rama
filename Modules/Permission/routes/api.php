<?php

use Illuminate\Support\Facades\Route;
use Modules\Permission\Http\Controllers\ModelHasRoleController;
use Modules\Permission\Http\Controllers\PermissionController;
use Modules\Permission\Http\Controllers\RoleController;
use Modules\Permission\Http\Controllers\RoleHasPermissionController;


Route::group(['middleware' => ['auth:api']], function () {
    Route::apiResources([
        'role-has-permissions' => RoleHasPermissionController::class,
        'roles' => RoleController::class,
        'model-has-roles' => ModelHasRoleController::class,
        'permissions' => PermissionController::class
    ]);

    Route::post('assign_superadmin', [RoleController::class, 'assignSuperadmin']);

    Route::get('get-users-with-roles', [ModelHasRoleController::class, 'getUsersWithRoles']);

    Route::post('{user}/demote-superadmin', [RoleController::class, 'demoteSuperadmin']);
});
