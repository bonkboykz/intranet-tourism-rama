<?php

namespace Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // public function index()
    // {
    //     $query = request()->query();
    //     $modelBuilder = User::queryable();
    //     if (array_key_exists('disabledPagination', $query)) {
    //         $data = $modelBuilder->get();
    //     } else {
    //         $data = $modelBuilder->paginate();
    //     }
    //     return response()->json([ 'data' => $data ]);
    // }
    public function index(Request $request)
    {
        $query = $request->query();
        $modelBuilder = User::query();

        // Handle search by name
        if ($request->has('search')) {
            $search = $request->input('search');
            $modelBuilder->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%']);

            // Skip pagination if search is present and disabledPagination is set
            if (array_key_exists('disabledPagination', $query)) {
                $data = $modelBuilder->get();
            } else {
                $data = $modelBuilder->paginate();
            }
        } else {
            // Handle pagination for general queries without search
            if (array_key_exists('disabledPagination', $query)) {
                $data = $modelBuilder->get();
            } else {
                $data = $modelBuilder->paginate();
            }
        }

        return response()->json(['data' => $data]);
    }

    public function show($id)
    {
        $user = User::where('id', $id)->queryable()->firstOrFail();

        $user->isSuperAdmin = $user->hasRole('superadmin');

        return response()->json([
            'data' => $user
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...User::rules());
        User::create($validated);

        return response()->noContent();
    }

    public function update(User $user)
    {
        $validated = request()->validate(...User::rules('update'));
        $user->update($validated);

        return response()->noContent();
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->noContent();
    }
}
