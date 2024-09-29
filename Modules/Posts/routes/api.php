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
    // GET stories
    Route::get('get_recent_stories', [PostController::class, 'getRecentStories'])->name('post.getRecentStories');

    Route::apiResources([
        'posts' => PostController::class,
        'post_accessibilities' => PostAccessibilityController::class,
        'post_comment' => PostCommentController::class,
    ]);

    Route::prefix('posts')->group(function () {
        Route::post('create_poll', [PostController::class, 'createPoll'])->name('post.createPoll');
        Route::post('{post}/like', [PostController::class, 'like'])->name('post.like');
        Route::post('{post}/unlike', [PostController::class, 'unlike'])->name('post.unlike');
        Route::post('{post}/comment', [PostController::class, 'comment'])->name('post.comment');
        Route::post('{post}/access', [PostController::class, 'access'])->name('post.access');
        // GET route to get all likes of a post, pass id
        Route::get('{id}/likes', [PostController::class, 'likes'])->name('post.likes');
        // POST route to mark as viewed
        Route::post('{id}/markAsViewed', [PostController::class, 'markAsViewed'])->name('post.markAsViewed');
        Route::post('{post}/haveAnsweredPoll', [PostController::class, 'haveAnsweredPoll'])->name('post.haveAnsweredPoll');
        Route::post('{post}/submitPollResponse', [PostController::class, 'submitPollResponse'])->name('post.submitPollResponse');
        Route::post('{post}/submitPollFeedback', [PostController::class, 'submitPollFeedback'])->name('post.submitPollFeedback');
        Route::post('{post}/calculatePollResults', [PostController::class, 'calculatePollResults'])->name('post.calculatePollResults');
    });


    Route::get('albums', [PostController::class, 'getAlbums'])->name('post.getAlbums');
    Route::get('users/{user}/polls', [PostController::class, 'getUserPolls'])->name('post.getUserPolls');
    Route::get('{post}/poll_feedback', [PostController::class, 'getPollFeedback'])->name('post.getPollFeedback');
    Route::get('public_media', [PostController::class, 'getPublicMedia'])->name('post.getPublicMedia');
    Route::get('get_media', [PostController::class, 'getMedia'])->name('post.getMedia');
    Route::put('{post}/announce', [PostController::class, 'announce'])->name('post.announce');
    Route::put('{post}/unannounce', [PostController::class, 'unannounce'])->name('post.unannounce');
    Route::put('{post}/close-poll', [PostController::class, 'closePoll'])->name('post.closePoll');
    Route::get('{post}/export-poll', [PostController::class, 'exportPoll'])->name('post.exportPoll');
    Route::put('{post}/update-poll', [PostController::class, 'updatePoll'])->name('post.updatePoll');
});
