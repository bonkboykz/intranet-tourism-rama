<?php

namespace Modules\Events\Http\Controllers;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
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
            $searchTerm = strtolower($request->input('search'));

            $modelBuilder->where(function ($query) use ($searchTerm) {
                $query->whereRaw('LOWER(title) LIKE ?', ['%' . $searchTerm . '%'])
                    ->orWhere(function ($query) use ($searchTerm) {
                        // For PostgreSQL, use TO_CHAR() to convert timestamp to string for searching
                        $query->whereRaw("TO_CHAR(start_at, 'YYYY-MM-DD') LIKE ?", ['%' . $searchTerm . '%'])
                            ->orWhereRaw("TO_CHAR(end_at, 'YYYY-MM-DD') LIKE ?", ['%' . $searchTerm . '%'])
                            ->orWhereRaw("TO_CHAR(start_at, 'YYYY MM DD') LIKE ?", ['%' . $searchTerm . '%'])
                            ->orWhereRaw("TO_CHAR(end_at, 'YYYY MM DD') LIKE ?", ['%' . $searchTerm . '%']);
                    });
            });
        }

        $startDate = $request->input('start');
        $endDate = $request->input('end');

        if ($startDate && $endDate) {
            // Handle events that overlap with the start and end range
            $modelBuilder->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_at', [$startDate, $endDate])  // Events starting within the range
                    ->orWhereBetween('end_at', [$startDate, $endDate])  // Events ending within the range
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        // Events spanning the entire range
                        $query->where('start_at', '<', $startDate)
                            ->where('end_at', '>', $endDate);
                    });
            });
        } elseif ($startDate) {
            // Handle filtering by start date only
            $modelBuilder->where('start_at', '>=', $startDate);
        } elseif ($endDate) {
            // Handle filtering by end date only
            $modelBuilder->where('end_at', '<=', $endDate);
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

    public function getUpcomingEvents()
    {
        $query = Event::query();

        $query->where('start_at', '>=', now());

        $query->orderBy('start_at', 'asc');
        // take only 5
        $query->limit(5);

        return response()->json(['data' => $query->get()]);
    }

    public function generatePdf(Request $request)
    {

        $query = $request->query();
        $modelBuilder = Event::queryable()->with('author');

        // Handle search by title
        if ($request->has('search')) {
            $searchTerm = strtolower($request->input('search'));

            $modelBuilder->where(function ($query) use ($searchTerm) {
                $query->whereRaw('LOWER(title) LIKE ?', ['%' . $searchTerm . '%'])
                    ->orWhere(function ($query) use ($searchTerm) {
                        // For PostgreSQL, use TO_CHAR() to convert timestamp to string for searching
                        $query->whereRaw("TO_CHAR(start_at, 'YYYY-MM-DD') LIKE ?", ['%' . $searchTerm . '%'])
                            ->orWhereRaw("TO_CHAR(end_at, 'YYYY-MM-DD') LIKE ?", ['%' . $searchTerm . '%'])
                            ->orWhereRaw("TO_CHAR(start_at, 'YYYY MM DD') LIKE ?", ['%' . $searchTerm . '%'])
                            ->orWhereRaw("TO_CHAR(end_at, 'YYYY MM DD') LIKE ?", ['%' . $searchTerm . '%']);
                    });
            });
        }

        $startDate = $request->input('start');
        $endDate = $request->input('end');

        if ($startDate && $endDate) {
            // Handle events that overlap with the start and end range
            $modelBuilder->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_at', [$startDate, $endDate])  // Events starting within the range
                    ->orWhereBetween('end_at', [$startDate, $endDate])  // Events ending within the range
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        // Events spanning the entire range
                        $query->where('start_at', '<', $startDate)
                            ->where('end_at', '>', $endDate);
                    });
            });
        } elseif ($startDate) {
            // Handle filtering by start date only
            $modelBuilder->where('start_at', '>=', $startDate);
        } elseif ($endDate) {
            // Handle filtering by end date only
            $modelBuilder->where('end_at', '<=', $endDate);
        }

        $events = $modelBuilder->get();

        // Load the PDF view and pass the events data
        $pdf = Pdf::loadView('events.pdf', [
            'events' => $events,
            'logoPath' => public_path('assets/logo.png'), // Path to the logo
            'title' => 'Joomla Events List' // The title for the PDF
        ]);

        // Return the generated PDF for download
        return $pdf->download('events.pdf');
    }
}
