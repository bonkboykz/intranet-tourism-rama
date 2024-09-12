<?php

namespace App\Models\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Nwidart\Modules\Facades\Module;
use Symfony\Component\Console\Output\ConsoleOutput;

trait QueryableApi
{
    public function scopeQueryable($query)
    {
        $query->when(request()->has('with'), function ($query) {
            $query->with(request('with'));
        });
        $query->when(request()->has('filter') || request()->has('filters'), function (Builder $query) {
            $filters = request('filter') ?? request('filters');
            if (!is_array($filters)) {
                return;
            }

            foreach ($filters as $filter) {
                if (!empty($filter['type']) && $filter['type'] == 'like') {
                    // Check if we are filtering a relationship field
                    if (strpos($filter['field'], '.') !== false) {
                        [$relation, $column] = explode('.', $filter['field'], 2);
                        $query->whereHas($relation, function ($q) use ($column, $filter) {
                            // Handle multiple mime_types using whereIn()
                            if (is_array($filter['value'])) {
                                $q->where(function ($query) use ($column, $filter) {
                                    foreach ($filter['value'] as $value) {
                                        $query->orWhere($column, 'like', '%' . $value . '%');
                                    }
                                });
                            } else {
                                // Single value
                                $q->where($column, 'like', '%' . $filter['value'] . '%');
                            }
                        });
                    } else {
                        // Direct field filter
                        if (is_array($filter['value'])) {
                            // Handle multiple mime_types using whereIn() for direct fields
                            $query->where(function ($query) use ($filter) {
                                foreach ($filter['value'] as $value) {
                                    $query->orWhere($filter['field'], 'like', '%' . $value . '%');
                                }
                            });
                        } else {
                            // Single value
                            $query->where($filter['field'], 'like', '%' . $filter['value'] . '%');
                        }
                    }
                } elseif ($filter['field'] == 'mentions') {
                    // Special case for filtering mentions JSON column
                    $query->whereJsonContains('mentions', $filter['value']);
                } else {
                    foreach ($filter as $filterBy => $value) {
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

        $query->when(request()->has('scope') || request()->has('scopes'), function ($query) {
            $scopes = request('scope') ?? request('scopes');
            foreach ($scopes as $scope) {
                foreach ($scope as $scopeBy => $value) {
                    if ($value == null || is_bool($value)) {
                        $query->$scopeBy();
                    } else {
                        if (is_array($value)) {
                            $query->$scopeBy(...$value);
                        } else {
                            $query->$scopeBy($value);
                        }
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
            $query->when(Module::find($module) && Module::isEnabled($module), fn($query) => $query->with($relation));
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
