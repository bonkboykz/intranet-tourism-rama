<?php

namespace Modules\Resources\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Modules\User\Models\User;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Resource extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi, HasUuids;

    protected $table = 'resources';

    protected $fillable = [
        'user_id',
        'attachable_type',
        'attachable_id',
        'for',
        'path',
        'extension',
        'mime_type',
        'filesize',
        'duration',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array'
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'user_id' => ['string'],
                    'attachable_type' => ['string'],
                    'attachable_id' => ['string'],
                    'for' => ['string'],
                    'path' => ['string'],
                    'extension' => ['string'],
                    'mime_type' => ['string'],
                    'filesize' => ['string'],
                    'duration' => ['string'],
                    'metadata' => ['string'],
                ],
                // [],
            ],
            'update' => [
                [
                    'user_id' => ['string'],
                    'attachable_type' => ['string'],
                    'attachable_id' => ['string'],
                    'for' => ['string'],
                    'path' => ['string'],
                    'extension' => ['string'],
                    'mime_type' => ['string'],
                    'filesize' => ['string'],
                    'duration' => ['string'],
                    'metadata' => ['string'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function accesses()
    {
        return $this->hasMany(ResourceAccess::class);
    }

    public function attachable()
    {
        return $this->morphTo();
    }

    public function scopeSearchByTag($query, $tags)
    {
        $query->whereRelation('attachable', 'tag', 'like', '%' . $tags . '%');
    }

    public function scopeAccessFor($query, $for)
    {
        $query->where('attachable_type', $for);
    }

    public function scopeAccessableBy($query, $accessableType, $accessableId)
    {
        $query->whereHas('attachable', function ($query) use ($accessableType, $accessableId) {
            $query->whereHas('accessibilities', function ($query) use ($accessableType, $accessableId) {
                $query
                    ->where('accessable_type', $accessableType)
                    ->where('accessable_id', $accessableId);
                ;
            });
        });
    }
}
