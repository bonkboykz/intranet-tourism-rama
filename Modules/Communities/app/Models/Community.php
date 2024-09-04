<?php

namespace Modules\Communities\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Settings\Models\CommunityPreference;
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
            'addMember' => [
                [
                    'user_id' => ['string', 'required'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    public function members()
    {
        return $this->belongsToMany(User::class, CommunityMember::class);
    }

    public function preferences()
    {
        return $this->hasMany(CommunityPreference::class);
    }
}
