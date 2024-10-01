<?php

namespace Modules\Profile\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\User\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;
use Modules\Profile\Http\Requests\ProfileUpdateRequest;
use Modules\Profile\Models\Profile;
use Symfony\Component\Console\Output\ConsoleOutput;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */


    public function index(Request $request)
    {
        $query = Profile::query();

        if ($request->has('filter')) {
            $filters = $request->get('filter');

            // Ensure $filters is an array
            if (is_string($filters)) {
                $filters = [$filters];
            }

            foreach ($filters as $filter) {
                if ($filter === 'dob') {
                    $query->whereNotNull('dob');
                }
                $query->select('bio', 'dob', 'image', 'user_id');
            }
        }


        $paginate = $request->has('paginate') ? (bool) $request->get('paginate') : true;

        $data = $paginate ? $this->shouldPaginate($query) : $query->get();

        return response()->json([
            'data' => $data,
        ]);
    }


    public function show($id)
    {
        return response()->json([
            'data' => Profile::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...Profile::rules());
        Profile::create($validated);

        return response()->noContent();
    }

    public function edit(Request $request): View
    {
        return view('profile::edit', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function updateUser(ProfileUpdateRequest $request)
    {

        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();
        return response()->noContent();

        // return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    // public function update(Profile $profile)
    // {
    //     $validated = request()->validate(...Profile::rules('update'));
    //     $resourceRef = uploadFile(request()->file('image'), null, 'avatar');

    //     $profile->update(array_merge($validated, ['image' => $resourceRef['path']]));

    //     return response()->noContent();
    // }

    public function update(Profile $profile)
    {

        DB::beginTransaction();
        try {
            request()->merge(input: ['bio' => request('name')]);
            if (!request()->has('phone_no')) {
                request()->merge(input: ['phone_no' => null]);
            }

            $validated = request()->validate(...Profile::rules('update'));
            $validatedUser = request()->validate(...User::rules('update'));

            $imagePath = $profile->image;
            if (request()->hasFile('image')) {
                $imagePath = uploadFile(request()->file('image'), null, 'avatar')['path'];
            }

            $coverPhotoPath = $profile->cover_photo;
            if (request()->hasFile('cover_photo')) {
                $coverPhotoPath = uploadFile(request()->file('cover_photo'), null, 'cover_photo')['path'];
            }

            $staffImagePath = $profile->staff_image;
            if (request()->hasFile('staff_image')) {
                $staffImagePath = uploadFile(request()->file('staff_image'), null, 'staff_image')['path'];
            }

            $profile->update(array_merge($validated, [
                'image' => $imagePath,
                'cover_photo' => $coverPhotoPath,
                'staff_image' => $staffImagePath,
            ]));

            if ($validated['phone_no'] && $validated['phone_no'] === 'null') {
                $profile->phone_no = null;
                $profile->save();
            }

            $profile->user()->update($validatedUser);
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }

        return response()->noContent();
    }

    public function updateProfileImage(Profile $profile)
    {
        $imagePath = uploadFile(request()->file('image'), null, 'avatar')['path'];

        $profile->update([
            'image' => $imagePath,
        ]);

        return response()->json([
            'profile' => $profile
        ]);
    }

    public function updateProfileCover(Profile $profile)
    {
        $coverPhotoPath = uploadFile(request()->file('cover_photo'), null, 'cover_photo')['path'];

        $profile->update([
            'cover_photo' => $coverPhotoPath,
        ]);

        return response()->json([
            'profile' => $profile
        ]);
    }

    /**
     * Delete the user's account.
     */
    public function deleteAccount(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function destroy(Profile $profile)
    {
        $profile->delete();
        return response()->noContent();
    }

    public function profileQr($id)
    {
        $user = User::findOrFail($id);
        return $user->vcard;
    }

    public function getAllBirthdays()
    {
        $data = Profile::whereNotNull('dob')->get();

        return response()->json([
            'data' => $data
        ]);
    }
}
