<?php

use App\Http\Controllers\CalendarController;
use App\Http\Controllers\Community;
use App\Http\Controllers\communityPost;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentOrdering;
use App\Http\Controllers\departments;
use App\Http\Controllers\fileManagement;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MediaController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StaffDirectoryController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\OrderingController;
use App\Http\Controllers\ManageLinksController;
use App\Http\Controllers\ManageFoldersController;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         //'laravelVersion' => Application::VERSION,
//         // 'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Redirect to login page
Route::get('/', function () {
    return redirect()->route('login');
});

// Logout route
Route::post('/logout', function () {
    Auth::logout();  // Call Laravel's built-in logout method

    return redirect('/');  // Redirect to home or login page
})->name('logout');
Route::get('/user/{id}/profile-qr', [ProfileController::class, 'profileQr'])->name('profileQr');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar');
    Route::get('/calendar/events', [CalendarController::class, 'getEvents'])->name('calendar.events');
    Route::post('/calendar/event', [CalendarController::class, 'handleDateSelect'])->name('calendar.event');
    Route::put('/calendar/event/{id}', [CalendarController::class, 'updateEvent'])->name('calendar.update');
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    // Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/user/{id}', [ProfileController::class, 'show'])->name('UserDetail');
    Route::get('/staffDirectory', [StaffDirectoryController::class, 'index'])->name('staffDirectory');
    Route::get('/ordering', [OrderingController::class, 'index'])->name('ordering');
    Route::get('/orderingDepartments', [DepartmentOrdering::class, 'index'])->name('orderingDepartments');
    Route::get('/notification', [NotificationController::class, 'index'])->name('notification');
    Route::get('/notipopup', [NotificationController::class, 'testing'])->name('Noti-popup-test');
    Route::get('/notification-unread', [NotificationController::class, 'index_unread'])->name('notification-unread');
    Route::get('/community', [Community::class, 'index'])->name('Community');

    Route::get('/departments', [departments::class, 'index'])->name('Departments');
    Route::get('/departmentInner', [departments::class, 'renderinner'])->name('DepartmentInner');
    Route::get('/communityInner', [Community::class, 'renderinner'])->name('CommunityInner');
    Route::get('/communityPost', [communityPost::class, 'index'])->name('communityPosts');
    Route::get('/fileManagement', [fileManagement::class, 'index'])->name('fileManagement');
    Route::get('/onlinelist', [DashboardController::class, 'onlinelist'])->name('onlinelist');
    Route::get('/link', [LinkController::class, 'index'])->name('link');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::get('/media', [MediaController::class, 'index'])->name('Media');
    Route::get('/manage-links', [ManageLinksController::class, 'index'])->name('manage-links');
    Route::get('/manage-folders', [ManageFoldersController::class, 'index'])->name('manage-folders');
});

require __DIR__ . '/auth.php';
