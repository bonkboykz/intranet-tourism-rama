<?php

namespace Modules\Permission\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Communities\Models\Community;
use Modules\Permission\Models\Role;
use Modules\User\Models\User;
use Symfony\Component\Console\Output\ConsoleOutput;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Role::queryable()->paginate(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => Role::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...Role::rules());
        Role::create($validated);

        return response()->noContent();
    }

    public function update(Role $role)
    {
        $validated = request()->validate(...Role::rules('update'));
        $role->update($validated);

        return response()->noContent();
    }

    public function destroy(Role $role)
    {
        $role->delete();

        return response()->noContent();
    }

    public function assignSuperadmin(Request $request)
    {
        // $user = User::find(auth()->id());
        // Check if the authenticated user has the 'assign super admins' permission
        $user = User::find(auth()->id());
        if (!$user->hasRole('superadmin', 'web')) {
            abort(403, 'Unauthorized action.');
        }

        // Validate the request (ensure the user ID is provided)
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Find the user by ID
        $user = User::findOrFail($request->user_id);

        // Assign the Super Admin role
        $user->assignRole('superadmin');

        return response()->json([
            'message' => 'Super Admin role has been assigned successfully to the user.',
        ]);
    }

    public function revokeSuperadmin(Request $request)
    {
        // $user = User::find(auth()->id());
        // Check if the authenticated user has the 'revoke super admins' permission
        $user = User::find(auth()->id());
        if (!$user->hasRole('superadmin', 'web')) {
            abort(403, 'Unauthorized action.');
        }

        // Validate the request (ensure the user ID is provided)
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        // Find the user by ID
        $user = User::findOrFail($request->user_id);

        // Revoke the Super Admin role
        $user->removeRole('superadmin');

        return response()->json([
            'message' => 'Super Admin role has been revoked successfully from the user.',
        ]);
    }


    public function demoteSuperadmin(User $user)
    {
        $user->removeRole('superadmin');

        return response()->json([
            'data' => $user,
            'message' => 'User has been demoted to a regular user.',
        ]);
    }
}
