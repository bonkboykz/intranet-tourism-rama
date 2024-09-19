<?php

namespace Modules\Communities\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Modules\User\Models\User;
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
        'banner_original',
        'is_archived',
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
                    'is_archived' => ['boolean'],
                    'banner_original' => ['string'],
                ],
                // [],
            ],
            'update' => [
                [
                    'name' => ['string', 'required'],
                    'banner' => ['string'],
                    'description' => ['nullable', 'string'],
                    'type' => ['string', 'required'],
                    'is_archived' => ['boolean'],
                    'banner_original' => ['nullable', 'string'],
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
        return $this->belongsToMany(User::class, 'community_members', 'community_id', 'user_id')
            ->withPivot('role');
    }

    public function preferences()
    {
        return $this->hasMany(CommunityPreference::class);
    }

    public function admins()
    {
        return $this->belongsToMany(User::class, 'community_admins');
    }
}
