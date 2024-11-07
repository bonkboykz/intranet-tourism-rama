<?php

use App\Http\Controllers\AvatarTemplateController;
use App\Http\Controllers\BirthdayTemplateController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\Community;
use App\Http\Controllers\communityPost;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentOrdering;
use App\Http\Controllers\departments;
use App\Http\Controllers\FileManagementController;
use App\Http\Controllers\GlobalSearchController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\PusherController;
use App\Http\Controllers\RequestController;
use App\Models\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StaffDirectoryController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\OrderingController;
use App\Http\Controllers\ManageLinksController;
use Modules\Crud\Http\Controllers\AuditController;
use App\Http\Controllers\ManageFoldersController;
use Modules\Settings\Http\Controllers\UserPreferenceController;


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

Route::get('/csrf-token', \App\Http\Controllers\RefreshCsrfTokenController::class);
action:
Route::post('/pusher/user-auth', [PusherController::class, 'pusherAuth']);

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
    Route::get('/profile/notifications', [NotificationController::class, 'index'])->name('notification');
    Route::get('/profile/unread-notifications', [NotificationController::class, 'index_unread'])->name('notification-unread');
    Route::get('/community', [Community::class, 'index'])->name('Community');
    Route::get('/manage-folders', [ManageFoldersController::class, 'index'])->name('manage-folders');
    Route::get('/departments', [departments::class, 'index'])->name('Departments');
    Route::get('/departmentInner', [departments::class, 'renderinner'])->name('DepartmentInner');
    Route::get('/communityInner', [Community::class, 'renderinner'])->name('CommunityInner');
    Route::get('/communityPost', [communityPost::class, 'index'])->name('communityPosts');
    Route::get('/file-management', [FileManagementController::class, 'index'])->name('FileManagement');
    Route::get('/onlinelist', [DashboardController::class, 'onlinelist'])->name('onlinelist');
    Route::get('/link', [LinkController::class, 'index'])->name('link');
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    Route::get('/media', [MediaController::class, 'index'])->name('Media');
    Route::get('/manage-links', [ManageLinksController::class, 'index'])->name('manage-links');
    Route::get('/album', [MediaController::class, 'indexalbum'])->name('Album');

    // TODO: Separate to modules later
    Route::get('/api/notifications', [NotificationController::class, 'apiIndex'])->name('notification');
    Route::get('/api/notifications/recent', action: [NotificationController::class, 'getRecentNotifications'])->name('recentNotifications');
    Route::get('/api/notifications/unread', action: [NotificationController::class, 'getUnreadNotifications'])->name('recentNotifications');
    Route::post('/api/markAsRead/{notificationId}', [NotificationController::class, 'markAsRead'])->name('markAsRead');

    Route::post('/api/createJoinGroupRequest', [RequestController::class, 'createJoinGroupRequest'])->name('createJoinGroupRequest');
    Route::get('/api/getGroupJoinRequests', [RequestController::class, 'getGroupJoinRequests'])->name('getGroupJoinRequests');
    Route::post('/api/approveGroupJoinRequest', [RequestController::class, 'approveGroupJoinRequest'])->name('approveGroupJoinRequest');
    Route::post('/api/rejectGroupJoinRequest', [RequestController::class, 'rejectGroupJoinRequest'])->name('rejectGroupJoinRequest');
    Route::post('/api/createChangeStaffImageRequest', [RequestController::class, 'createChangeStaffImageRequest'])->name('createChangeStaffImageRequest');
    Route::get('/api/getChangeStaffImageRequests', [RequestController::class, 'getChangeStaffImageRequests'])->name('getChangeStaffImageRequests');
    Route::post('/api/approveChangeStaffImageRequest', [RequestController::class, 'approveChangeStaffImageRequest'])->name('approveChangeStaffImageRequest');
    Route::post('/api/rejectChangeStaffImageRequest', [RequestController::class, 'rejectChangeStaffImageRequest'])->name('rejectChangeStaffImageRequest');
    Route::post('/api/createCommunityCreateRequest', [RequestController::class, 'createCommunityCreateRequest'])->name('createCommunityCreateRequest');
    Route::post('/api/deleteCommunityDeleteRequest', [RequestController::class, 'deleteCommunityDeleteRequest'])->name('deleteCommunityDeleteRequest');
    Route::get('/api/getCommunityDeleteRequests', [RequestController::class, 'getCommunityDeleteRequests'])->name('getCommunityDeleteRequests');
    Route::post('/api/approveCommunityDeleteRequest', [RequestController::class, 'approveCommunityDeleteRequest'])->name('approveCommunityDeleteRequest');
    Route::post('/api/rejectCommunityDeleteRequest', [RequestController::class, 'rejectCommunityDeleteRequest'])->name('rejectCommunityDeleteRequest');
    Route::get('/api/getCommunityCreateRequests', [RequestController::class, 'getCommunityCreateRequests'])->name('getCommunityCreateRequests');
    Route::post('/api/approveCommunityCreateRequest', [RequestController::class, 'approveCommunityCreateRequest'])->name('approveCommunityCreateRequest');
    Route::post('/api/rejectCommunityCreateRequest', [RequestController::class, 'rejectCommunityCreateRequest'])->name('rejectCommunityCreateRequest');
    Route::put('/api/createRequestForUpdateProfileDepartment/{departmentId}', [RequestController::class, 'createRequestForUpdateProfileDepartment'])->name('createRequestForUpdateProfileDepartment');
    Route::post('/api/approveRequestForUpdateProfileDepartment', [RequestController::class, 'approveRequestForUpdateProfileDepartment'])->name('approveRequestForUpdateProfileDepartment');
    Route::post('/api/rejectRequestForUpdateProfileDepartment', [RequestController::class, 'rejectRequestForUpdateProfileDepartment'])->name('rejectRequestForUpdateProfileDepartment');
    Route::get('/api/getRequestForUpdateProfileDepartment', [RequestController::class, 'getRequestForUpdateProfileDepartment'])->name('getRequestForUpdateProfileDepartment');

    Route::get('/api/audits', [AuditController::class, 'index'])->name('audits');
    Route::post('/api/birthday-templates', [BirthdayTemplateController::class, 'store']);
    Route::get('/api/birthday-templates', [BirthdayTemplateController::class, 'index']);
    Route::put('/api/birthday-templates/{birthdayTemplate}', [BirthdayTemplateController::class, 'update']);
    Route::delete('/api/birthday-templates/{birthdayTemplate}', [BirthdayTemplateController::class, 'destroy']);
    Route::put('/api/birthday-templates/{birthdayTemplate}/toggle-enabled', [BirthdayTemplateController::class, 'toggleEnabled']);

    Route::get('/api/avatar-templates', [AvatarTemplateController::class, 'index']);
    Route::post('/api/avatar-templates', [AvatarTemplateController::class, 'store']);
    Route::put('/api/avatar-templates/{avatarTemplate}', [AvatarTemplateController::class, 'update']);
    Route::delete('/api/avatar-templates/{avatarTemplate}', [AvatarTemplateController::class, 'destroy']);
    Route::put('/api/avatar-templates/{avatarTemplate}/toggle-enabled', [AvatarTemplateController::class, 'toggleEnabled']);

    Route::get('/search', [GlobalSearchController::class, 'index'])->name('search');
    Route::get('/api/search', [GlobalSearchController::class, 'search'])->name('search.results');
    Route::get('/api/search-posts', [GlobalSearchController::class, 'searchPosts'])->name('search.searchPosts');
    Route::get('/api/update-search-index', [GlobalSearchController::class, 'updateSearchIndex'])->name('search.updateSearchIndex');
});

Route::get('/user/{id}/qr', [ProfileController::class, 'profileQr'])->name('profileQr');

require __DIR__ . '/auth.php';
