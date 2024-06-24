<?php

namespace Modules\Communities\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\App\Settings\Models\CommunityPreference;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Community extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi;

    protected $table = 'communities';

    protected $fillable = [
        'name',
        'banner',
        'description',
        'type',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'name' => ['string', 'required'],
                    'banner' => ['string'],
                    'description' => ['string'],
                    'type' => ['string', 'required'],
                ],
                // [],
            ],
            'update' => [
                [
                    'name' => ['string', 'required'],
                    'banner' => ['string'],
                    'description' => ['string'],
                    'type' => ['string', 'required'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    public function members()
    {
        return $this->hasMany(CommunityMember::class);
    }

    public function preferences()
    {
        return $this->hasMany(CommunityPreference::class);
    }
}
