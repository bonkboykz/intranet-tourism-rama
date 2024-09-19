<?php

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Modules\Department\Jobs\DepartmentWishBirthday;
use Sentry\Laravel\Integration;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        channels: __DIR__ . '/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\ForceHttps::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->api(prepend: [
            \App\Overides\EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    // ->withSchedule(function (Schedule $schedule) {
    //     $schedule->job(DepartmentWishBirthday::class)->dailyAt('07:00');
    // })
    ->withSchedule(function (Schedule $schedule) {
        // Schedule::command('telescope:prune')->daily();
        $schedule->command('telescope:prune')->daily();
    })
    // ->withBroadcasting(
    //     __DIR__ . '/../routes/channels.php',
    //     ['prefix' => 'api', 'middleware' => ['api', 'auth:sanctum']],
    // )
    ->withExceptions(function (Exceptions $exceptions) {
        Integration::handles($exceptions);
    })->create();
