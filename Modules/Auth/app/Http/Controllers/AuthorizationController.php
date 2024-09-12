<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class AuthorizationController extends Controller
{
    public function syncRoles(Request $request, User $user)
    {
        DB::beginTransaction();
        try {
            $request->validate(['roles' => ['required']]);
            $user->syncRoles(Role::whereIn('id', request('roles'))->get())->save();
            abort_unless(User::role('Pentadbir Sistem', 'web')->count(), 422, 'Pentadbir Sistem perlu ada sekurang-kurangnya satu pengguna.');
            DB::commit();

            return response()->noContent();
        } catch (\Throwable $th) {
            DB::rollback();
            throw $th;
        }
    }
}
