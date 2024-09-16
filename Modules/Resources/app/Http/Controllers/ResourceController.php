<?php

namespace Modules\Resources\Http\Controllers;

use App\Http\Controllers\Controller;
use Auth;
use Modules\Posts\Models\Post;
use Modules\Resources\Models\Resource;
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
        return response()->json([
            'data' => Resource::where('id', $id)->queryable()->firstOrFail(),
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

    public function destroy(Resource $resource)
    {
        $resource->delete();

        return response()->noContent();
    }

    public function getPublicResources()
    {
        $user = Auth::user(); // Get the authenticated user

        $query = Resource::queryable(); // Start a new query for the Resource model


        // Eager load the author and attachable relationships (for standalone and attached resources)
        $query->with(relations: ['author', 'attachable']);

        if (!$user->hasRole('superadmin')) {
            $query->where(function ($query) use ($user) {
                // User's own files (where they are the author)
                $query->where('user_id', $user->id) // User's own files
                    ->orWhere(function ($query) use ($user) {
                        // Resources attached to posts with type 'files'
                        $query->where('attachable_type', "posts") // Attached to posts
                            ->whereHas('attachable', function ($query) use ($user) {
                            $query->where('type', 'files') // Only posts of type 'files'
                                ->where(function ($query) use ($user) {
                                    // Access to posts with no community or public community
                                    $query->whereNull('community_id') // No community
                                        ->orWhereHas('community', function ($query) use ($user) {
                                        $query->where('type', 'public') // Public community
                                            ->orWhereHas('members', function ($query) use ($user) {
                                                $query->where('user_id', $user->id); // Private community, user is a member
                                            });
                                    });
                                })
                                ->where(function ($query) use ($user) {
                                    // Access to posts with no department or where user is employed in the department
                                    $query->whereNull('department_id') // No department
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
        // order by created at desc
        $query->orderBy('created_at', 'desc');

        // $output = new ConsoleOutput();

        // function replaceBindings($sql, $bindings)
        // {
        //     foreach ($bindings as $binding) {
        //         $value = is_numeric($binding) ? $binding : "'" . addslashes($binding) . "'";
        //         $sql = preg_replace('/\?/', $value, $sql, 1);
        //     }
        //     return $sql;
        // }

        // $sql = $query->toSql(); // Get the raw SQL query
        // $bindings = $query->getBindings(); // Get the query bindings (parameters)
        // // Show the full SQL query with bindings replaced
        // $fullSql = replaceBindings($sql, $bindings);

        // $output->writeln($fullSql);

        // Pagination or other data handling logic
        $data = $this->shouldPaginate($query);

        // Return the result as JSON
        return response()->json([
            'data' => $data,
        ]);
    }
}
