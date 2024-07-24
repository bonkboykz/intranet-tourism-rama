<?php

namespace App\Models\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Nwidart\Modules\Facades\Module;

trait QueryableApi
{
    public function scopeQueryable($query)
    {
        $query->when(request()->has('with'), function ($query) {
            $query->with(request('with'));
        });

        $query->when(request()->has('filter'), function (Builder $query) {
            $filters = request('filter') ?? request('filters');
            if (!is_array($filters)) {
                return;
            }
            foreach ($filters as $filter) {
                if (!empty($filter['type']) && $filter['type'] == 'like') {
                    $query->where($filter['field'], $filter['type'], '%' . $filter['value'] . '%');
                } else {
                    foreach ($filter as $filterBy => $value) {
                        // dd($filterBy, ...$value);
                        if (is_array($value)) {
                            $query->$filterBy(...$value);
                        } else {
                            $query->$filterBy($value);
                        }
                    }
                }
            }
        });

        // $query->when(request()->has('search'), function ($query) {
        //     foreach (request('search') as $filter) {
        //         foreach ($filter as $filterBy => $value) {

        //             $query->whereAny([], $value);
        //         }
        //     }
        // });


        $query->when(request()->has('sort'), function ($query) {
            foreach (request('sort') as $sort) {
                $query->orderBy(key($sort), current($sort) ?? 'asc');
            }
        });

        $query->when(request()->has('scope'), function ($query) {
            foreach (request('scope') as $scope) {
                foreach ($scope as $scopeBy => $value) {
                    if ($value == null || is_bool($value)) {
                        $query->$scopeBy();
                    } else {
                        $query->$scopeBy($value);
                    }
                }
            }
        });
    }

    public function scopeWithModuleRelation($query, $module, $relation)
    {
        if (is_callable($relation)) {
            $query->when(Module::find($module) && Module::isEnabled($module), $relation);
        } else {
            $query->when(Module::find($module) && Module::isEnabled($module), fn ($query) => $query->with($relation));
        }
    }

    /**
     * Get the user that owns the QueryableApi
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user that owns the QueryableApi
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
