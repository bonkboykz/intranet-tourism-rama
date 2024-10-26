<?php

namespace Modules\Department\Http\Controllers;

use App\Http\Controllers\Controller;
use DB;
use Modules\Department\Models\BusinessPost;
use Modules\Department\Models\EmploymentPost;
use Symfony\Component\Console\Output\ConsoleOutput;

class BusinessPostController extends Controller
{
    public function index()
    {
        $limit = request()->get('perpage', 15);

        return response()->json([
            'data' => BusinessPost::queryable()->paginate($limit),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => BusinessPost::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    // public function store()
    // {
    //     $validated = request()->validate(...BusinessPost::rules());
    //     BusinessPost::create($validated);

    //     return response()->noContent();
    // }

    public function store()
    {
        $validated = request()->validate(...BusinessPost::rules());
        $businessPost = BusinessPost::create($validated);

        return response()->json([
            'data' => $businessPost,
        ], 201);
    }

    public function update(BusinessPost $business_post)
    {
        $validated = request()->validate(...BusinessPost::rules('update'));
        $business_post->update($validated);

        return response()->noContent();
    }

    public function destroy(BusinessPost $business_post)
    {
        try {
            DB::beginTransaction();
            // 1. find all employment_posts with such business_post
            $employment_posts = EmploymentPost::where('business_post_id', $business_post->id)->get();

            // 2. find business post with title "No Title"
            $no_title_business_post = BusinessPost::where('title', 'No title')->first();

            $output = new ConsoleOutput();
            $output->writeln($no_title_business_post);


            // 2.1 If not found, create one
            if (!$no_title_business_post) {
                $no_title_business_post = BusinessPost::create([
                    'title' => 'No title',
                ]);
            }

            // 3. transfer all found employment_posts to business post with title "No Title"
            foreach ($employment_posts as $employment_post) {
                $employment_post->update([
                    'business_post_id' => $no_title_business_post->id,
                ]);
            }

            // 4. delete business post
            $business_post->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to delete business post',
            ], 500);
        }

        return response()->noContent();
    }
}
