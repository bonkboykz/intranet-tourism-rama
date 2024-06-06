<?php

namespace Modules\Crud\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use App\Models\User;
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
}
