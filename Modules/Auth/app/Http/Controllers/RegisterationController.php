<?php

namespace Modules\Auth\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Nwidart\Modules\Facades\Module;

class RegisterationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        DB::beginTransaction();
        try {

            $request->validate(...User::rules('register'));

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make(request('password')),
            ]);

            if (Module::find('Authorization') && Module::isEnabled('Authorization')) {
                $user->assignRole('guest');
            }

            event(new Registered($user));
            DB::commit();

            return $this->success('Succesfull Register', $user);
        } catch (\Throwable $th) {
            DB::rollback();
            throw $th;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function success(string $message, mixed $data = null)
    {
        $response = [
            'message' => $message,
            'status' => $data ? 200 : 500,
            'data' => $data,
        ];

        return response()->json($response);
    }
}
