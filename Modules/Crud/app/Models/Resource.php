<?php

namespace Modules\Crud\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Laravel\Scout\Searchable;
use Modules\User\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Resource extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi, HasUuids, Searchable;

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
                    'user_id' => ['string', 'required'],
                    'attachable_type' => ['string', 'required'],
                    'attachable_id' => ['string', 'required'],
                    'for' => ['string', 'required'],
                    'path' => ['string', 'required'],
                    'extension' => ['string', 'required'],
                    'mime_type' => ['string', 'required'],
                    'filesize' => ['string', 'required'],
                    'duration' => ['string'],
                    'metadata' => ['string', 'required'],
                ],
                // [],
            ],
            'update' => [
                [
                    'user_id' => ['string', 'required'],
                    'attachable_type' => ['string', 'required'],
                    'attachable_id' => ['string', 'required'],
                    'for' => ['string', 'required'],
                    'path' => ['string', 'required'],
                    'extension' => ['string', 'required'],
                    'mime_type' => ['string', 'required'],
                    'filesize' => ['string', 'required'],
                    'duration' => ['string'],
                    'metadata' => ['string', 'required'],
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

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'attachable_type' => $this->attachable_type,
            'attachable_id' => $this->attachable_id,
            'for' => $this->for,
            'path' => $this->path,
            'extension' => $this->extension,
            'mime_type' => $this->mime_type,
            'filesize' => $this->filesize,
            'duration' => $this->duration,
            'metadata' => $this->metadata,
        ];
    }
}
