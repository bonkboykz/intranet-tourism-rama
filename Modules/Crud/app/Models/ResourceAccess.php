<?php

namespace Modules\Crud\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Modules\User\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class ResourceAccess extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi;

    protected $table = 'resource_access';

    protected $fillable = [
        'user_id',
        'resource_id',
        'ability',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'user_id' => ['string', 'required'],
                    'resource_id' => ['string', 'required'],
                    'ability' => ['string', 'required'],
                ],
                // [],
            ],
            'update' => [
                [
                    'user_id' => ['string', 'required'],
                    'resource_id' => ['string', 'required'],
                    'ability' => ['string', 'required'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
