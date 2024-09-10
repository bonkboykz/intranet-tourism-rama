<?php

use Illuminate\Support\Facades\Route;
use Modules\Crud\Http\Controllers\FullDistinctGradeController;

Route::get('distinct-schema-grades', [FullDistinctGradeController::class, 'getDistinctGrades']);


Route::apiResources([
    'audits' => \Modules\Crud\Http\Controllers\AuditController::class,
    'business_grades' => \Modules\Crud\Http\Controllers\BusinessGradeController::class,
    'business_posts' => \Modules\Crud\Http\Controllers\BusinessPostController::class,
    'business_schemes' => \Modules\Crud\Http\Controllers\BusinessSchemeController::class,
    'business_units' => \Modules\Crud\Http\Controllers\BusinessUnitController::class,
    'cache' => \Modules\Crud\Http\Controllers\CacheController::class,
    'cache_locks' => \Modules\Crud\Http\Controllers\CacheLockController::class,
    'communities' => \Modules\Crud\Http\Controllers\CommunityController::class,
    'community_members' => \Modules\Crud\Http\Controllers\CommunityMemberController::class,
    'community_preferences' => \Modules\Crud\Http\Controllers\CommunityPreferenceController::class,
    'departments' => \Modules\Crud\Http\Controllers\DepartmentController::class,
    'department_preferences' => \Modules\Crud\Http\Controllers\DepartmentPreferenceController::class,
    'employment_posts' => \Modules\Crud\Http\Controllers\EmploymentPostController::class,
    'events' => \Modules\Crud\Http\Controllers\EventController::class,
    'event_attendance' => \Modules\Crud\Http\Controllers\EventAttendanceController::class,
    'external_links' => \Modules\Crud\Http\Controllers\ExternalLinkController::class,
    'failed_jobs' => \Modules\Crud\Http\Controllers\FailedJobController::class,
    'invitations' => \Modules\Crud\Http\Controllers\InvitationController::class,
    'jobs' => \Modules\Crud\Http\Controllers\JobController::class,
    'job_batches' => \Modules\Crud\Http\Controllers\JobBatchController::class,
    'migrations' => \Modules\Crud\Http\Controllers\MigrationController::class,
    'model_has_permissions' => \Modules\Crud\Http\Controllers\ModelHasPermissionController::class,
    'model_has_roles' => \Modules\Crud\Http\Controllers\ModelHasRoleController::class,
    // 'notifications' => \Modules\Crud\Http\Controllers\NotificationController::class,
    'password_reset_tokens' => \Modules\Crud\Http\Controllers\PasswordResetTokenController::class,
    'permissions' => \Modules\Crud\Http\Controllers\PermissionController::class,
    'posts' => \Modules\Crud\Http\Controllers\PostController::class,
    'post_accessibilities' => \Modules\Crud\Http\Controllers\PostAccessibilityController::class,
    'post_comment' => \Modules\Crud\Http\Controllers\PostCommentController::class,
    'preference_schemas' => \Modules\Crud\Http\Controllers\PreferenceSchemaController::class,
    'profiles' => \Modules\Crud\Http\Controllers\ProfileController::class,
    'resources' => \Modules\Crud\Http\Controllers\ResourceController::class,
    'resource_access' => \Modules\Crud\Http\Controllers\ResourceAccessController::class,
    'roles' => \Modules\Crud\Http\Controllers\RoleController::class,
    'role_has_permissions' => \Modules\Crud\Http\Controllers\RoleHasPermissionController::class,
    'sessions' => \Modules\Crud\Http\Controllers\SessionController::class,
    'settings' => \Modules\Crud\Http\Controllers\SettingController::class,
    'supervisors' => \Modules\Crud\Http\Controllers\SupervisorController::class,
    'tasks' => \Modules\Crud\Http\Controllers\TaskController::class,
    'task_items' => \Modules\Crud\Http\Controllers\TaskItemController::class,
    'users' => \Modules\Crud\Http\Controllers\UserController::class,
    'user_preferences' => \Modules\Crud\Http\Controllers\UserPreferenceController::class,
]);
