<?php

namespace Modules\Auth\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
// use Modules\User\Models\User;
use Database\Factories\ProfileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use Illuminate\Database\Eloquent\Factories\Factory;

class SocialAccount extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi;

    protected $table = 'social_accounts';

    protected $fillable = [
        'user_id',
        'provider',
        'provider_user_id',
        'token',
        'token_secret',
        'refresh_token',
        'expires_in',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'user_id' => ['string', 'required'],
                    'provider' => ['string', 'required'],
                    'provider_user_id' => ['string', 'required'],
                    'token' => ['string', 'required', 'unique'],
                    'token_secret' => ['string'],
                    'refresh_token' => ['string'],
                    'expires_in' => ['number'],
                ],
            ],
            'update' => [
                [
                    'user_id' => ['string', 'required'],
                    'provider' => ['string', 'required'],
                    'provider_user_id' => ['string', 'required'],
                    'token' => ['string', 'required', 'unique'],
                    'token_secret' => ['string'],
                    'refresh_token' => ['string'],
                    'expires_in' => ['number'],
                ],
            ],
        ];

        return $rules[$scenario];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
