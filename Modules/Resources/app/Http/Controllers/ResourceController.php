<?php

namespace Modules\Resources\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Modules\Posts\Models\Post;
use Modules\Resources\Models\Resource;
use Modules\User\Models\User;
use Symfony\Component\Console\Output\ConsoleOutput;

class ResourceController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => $this->shouldPaginate(Resource::queryable()),
        ]);
    }

    public function show($id)
    {
        $resource = Resource::findOrFail($id);

        return response()->json([
            'data' => $resource,
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...Resource::rules());
        Resource::create($validated);

        return response()->noContent();
    }

    public function update(Resource $resource)
    {
        $validated = request()->validate(...Resource::rules('update'));
        $resource->update($validated);

        return response()->noContent();
    }

    public function renameResource(Resource $resource)
    {
        $validated = request()->validate([
            'original_name' => ['required', 'string'],
        ]);

        if (is_string($resource->metadata)) {
            $resource->metadata = json_decode($resource->metadata, true);
        }
        // update json metadata with original name leaving everything else intact in the metadata field
        $resource->metadata = array_merge(
            $resource->metadata,
            ['original_name' => $validated['original_name']]
        );

        $resource->save();

        return response()->noContent();
    }

    public function destroy(Resource $resource)
    {
        $resource->delete();

        return response()->noContent();
    }

    public function getPublicResources()
    {
        $user = User::where('id', Auth::id())->firstOrFail();;
        $query = Resource::query();

//        $query = Resource::queryable(); // Start a new query for the Resource model
        $query->with(['user', 'attachable']);

        $excludedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'mp4', 'mov'];
        $query->whereNotIn(DB::raw("metadata->>'extension'"), $excludedExtensions);

        $is_community = false;
        $is_department = false;
        $is_user = false;

        if (request()->has('filter')) {
            $filters = request('filter');
            foreach ($filters as $filter) {
                if ($filter['field'] == 'attachable.community_id') {
                    $is_community = true;
                }
                if ($filter['field'] == 'attachable.department_id') {
                    $is_department = true;
                }
                if ($filter['field'] == 'attachable.user_id') {
                    $is_user = true;
                }
            }
        }

        if ($searchTerm = request('searchTerm')) {
                $query->where(function ($query) use ($searchTerm) {
                    $query->orWhere('metadata->extension', 'ilike', "%$searchTerm%")
                        ->orWhere('metadata->mime_type', 'ilike', "%$searchTerm%")
                        ->orWhere('metadata->original_name', 'ilike', "%$searchTerm%")
                        ->orWhereHas('user', function ($q) use ($searchTerm) {
                            $q->where('name', 'ilike', "%$searchTerm%");
                        });
                });
        }


        if ((request()->has('isManagement') && !$user->hasRole('superadmin')) && !$is_community && !$is_department && !$is_user) {
            $query->where(function ($query) use ($user) {
                // User's own files (where they are the author)
                $query->where('user_id', $user->id) // User's own files
                ->orWhere(function ($query) use ($user) {
                    // Resources attached to posts with type 'files'
                    $query->where('attachable_type', "posts") // Attached to posts
                    ->whereHas('attachable', function ($query) use ($user) {
                        $query->where(function ($query) use ($user) {
                            // Check if the post belongs to no community or a public community, or the user is a member of the private community
                            $query->whereNull('community_id')
                                ->orWhereHas('community', function ($query) use ($user) {
                                    $query->whereHas('members', function ($query) use ($user) {
                                        $query->where('user_id', $user->id); // User is a member of the private community
                                    });
                                });
                        })
                            ->where(function ($query) use ($user) {
                                // Check if the post belongs to no department or if the user is employed in the department
                                $query->whereNull('department_id')
                                    ->orWhereHas('department', function ($query) use ($user) {
                                        $query->whereHas('employmentPosts', function ($query) use ($user) {
                                            $query->where('user_id', $user->id); // User is employed in the department
                                        });
                                    });
                            });
                    });
                });
            });
        }

        $query->orderBy('created_at', 'desc');

        $data = $this->shouldPaginate($query);

        return response()->json([
            'data' => $data,
        ]);
    }

}
