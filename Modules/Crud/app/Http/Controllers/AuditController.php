<?php

namespace Modules\Crud\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Crud\Models\Audit;

class AuditController extends Controller
{
    public function index()
    {
        $query = Audit::queryable();

        $query->with(['user.roles']);

        if (request()->has('search')) {
            $query->where('event', 'ilike', '%' . request('search') . '%')
                ->orWhere('auditable_type', 'ilike', '%' . request('search') . '%')
                ->orWhere('auditable_id', 'ilike', '%' . request('search') . '%');
        }

        if (request()->has('start_date')) {
            $query->where('created_at', '>=', request('start_date'));
        }

        if (request()->has('end_date')) {
            $query->where('created_at', '<=', request('end_date'));
        }
        if (request()->has('role')) {
            $role = request('role');

            if ($role === 'superadmin') {
                $query->whereHas('user.roles', function ($q) {
                    $q->where('name', 'superadmin');
                });
            } elseif ($role === 'community admin') {
                $query->whereHas('user.roles', function ($q) {
                    $q->where('name', 'like', 'community admin%');
                });
            } elseif ($role === 'department admin') {
                $query->whereHas('user.roles', function ($q) {
                    $q->where('name', 'like', 'department admin%');
                });
            } elseif ($role === 'user') {
                $query->whereHas('user.roles', function ($q) {
                    $q->where('name', 'user');
                });
            }
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
