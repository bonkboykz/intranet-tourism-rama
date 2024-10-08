<?php

use Illuminate\Support\Facades\Route;
use Modules\Polls\Http\Controllers\FeedbackController;
use Modules\Polls\Http\Controllers\OptionController;
use Modules\Polls\Http\Controllers\PollsController;
use Modules\Polls\Http\Controllers\QuestionController;
use Modules\Polls\Http\Controllers\ResponseController;
use Modules\Posts\Http\Controllers\PostAccessibilityController;
use Modules\Posts\Http\Controllers\PostCommentController;
use Modules\Posts\Http\Controllers\PostController;

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
    'polls' => PollsController::class,
    'questions' => QuestionController::class,
    'options' => OptionController::class,
    'responses' => ResponseController::class,
    'feedbacks' => FeedbackController::class
]);
