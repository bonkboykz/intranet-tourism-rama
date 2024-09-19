<?php

namespace Modules\Events\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Events\Models\Event;
use Illuminate\Http\Request;
use Modules\Events\Models\EventAttendance;
use Symfony\Component\Console\Output\ConsoleOutput;

class EventController extends Controller
{
    // public function index()
    // {
    //     return response()->json([
    //         'data' => $this->shouldpaginate(Event::queryable()),
    //     ]);
    // }

    public function index(Request $request)
    {
        $query = $request->query();
        $modelBuilder = Event::queryable();

        // Handle search by title
        if ($request->has('search')) {
            $search = $request->input('search');
            $modelBuilder->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($search) . '%']);
            $modelBuilder->select('id', 'title', 'start_at', 'end_at');
        }


        // Handle pagination
        if (array_key_exists('disabledPagination', $query)) {
            $data = $modelBuilder->get();
        } else {
            $data = $modelBuilder->paginate();
        }

        return response()->json(['data' => $data]);
    }

    public function show($id)
    {
        return response()->json([
            'data' => Event::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        // if no description, put empty string
        request()->merge(['description' => request()->description ?? '']);
        $validated = request()->validate(...Event::rules());
        $createdEvent = Event::create($validated);

        return response()->json(['data' => $createdEvent]);
    }

    public function update(Event $event)
    {
        $validated = request()->validate(...Event::rules('update'));
        $event->update($validated);

        return response()->noContent();
    }

    public function invite(Event $event)
    {
        abort_unless(auth()->id() == $event->created_by, 403, 'You are not allowed to invite people to this event.');
        $validated = request()->validate(...Event::rules('invite'));
        $attendances = collect(collect($validated)->get('users'))->map(fn($item) => ['user_id' => $item['id']])->toArray();
        $event->attendances()->createMany($attendances);

        return response()->noContent();
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->noContent();
    }

    public function getEvents()
    {
        $events = Event::all(['id', 'title', 'start_time as start', 'end_time as end', 'color']);

        return response()->json($events);
    }

    public function handleDateSelect($request)
    {
        $validatedData = $request->validate([
            'title' => 'required',
            'start' => 'required|date',
            'end' => 'required|date|after:start',
            'color' => 'required',
        ]);

        $event = new Event();
        $event->title = $validatedData['title'];
        $event->start_time = $validatedData['start'];
        $event->end_time = $validatedData['end'];
        $event->color = $validatedData['color'];
        $event->save();

        return response()->json(['success' => true, 'message' => 'Event created successfully']);
    }
}
