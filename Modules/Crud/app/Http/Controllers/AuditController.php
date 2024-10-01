<?php

namespace Modules\Crud\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Crud\Models\Audit;

class AuditController extends Controller
{
    public function index()
    {
        $query = Audit::queryable();

        // Загружаем пользователей и их роли
        $query->with(['user.roles']);

        if (request()->has('search')) {
            $query->where('event', 'like', '%' . request('search') . '%')
                ->orWhere('auditable_type', 'like', '%' . request('search') . '%');
        }

        if (request()->has('start_date')) {
            $query->where('created_at', '>=', request('start_date'));
        }

        if (request()->has('end_date')) {
            $query->where('created_at', '<=', request('end_date'));
        }

        $data = $query->paginate();

        return response()->json([
            'data' => $data,
        ]);
    }



    public function show($id)
    {
        return response()->json([
            'data' => Audit::where('id', $id)->queryable()->firstOrFail(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate(...Audit::rules());
        Audit::create($validated);

        return response()->noContent();
    }

    public function update(Audit $audit)
    {
        $validated = request()->validate(...Audit::rules('update'));
        $audit->update($validated);

        return response()->noContent();
    }

    public function destroy(Audit $audit)
    {
        $audit->delete();

        return response()->noContent();
    }
}
