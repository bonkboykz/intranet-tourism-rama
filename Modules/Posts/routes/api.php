<?php

use Illuminate\Support\Facades\Route;
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
Route::group(['middleware' => ['auth:api']], function () {

    Route::apiResources([
        'posts' => PostController::class,
        'post_accessibilities' => PostAccessibilityController::class,
        'post_comment' => PostCommentController::class,
    ]);

    Route::prefix('posts')->group(function () {
        Route::post('{post}/like', [PostController::class, 'like'])->name('post.like');
        Route::post('{post}/unlike', [PostController::class, 'unlike'])->name('post.unlike');
        Route::post('{post}/comment', [PostController::class, 'comment'])->name('post.comment');
        Route::post('{post}/access', [PostController::class, 'access'])->name('post.access');
        // GET route to get all likes of a post, pass id
        Route::get('{id}/likes', [PostController::class, 'likes'])->name('post.likes');
    });
});
