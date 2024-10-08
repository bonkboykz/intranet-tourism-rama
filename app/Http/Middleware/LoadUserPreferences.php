<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Modules\Settings\Models\UserPreference;

class LoadUserPreferences
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $userThemePreference = UserPreference::where('user_id', Auth::id())
                ->where('group', 'THEME')
                ->where('key', 'theme')
                ->value('value') ?? 'theme-1'; // Default to 'theme-1' if not set

            // Share with Inertia
            Inertia::share('userTheme', $userThemePreference);
        }

        return $next($request);
    }
}
