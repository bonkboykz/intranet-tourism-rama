<?php

namespace Modules\Crud\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\User\Models\User;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Audit extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi;

    protected $table = 'audits';

    protected $fillable = [
        'user_type',
        'user_id',
        'event',
        'auditable_type',
        'auditable_id',
        'old_values',
        'new_values',
        'url',
        'ip_address',
        'user_agent',
        'tags',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'user_type' => ['string'],
                    'user_id' => ['string'],
                    'event' => ['string', 'required'],
                    'auditable_type' => ['string', 'required'],
                    'auditable_id' => ['string', 'required'],
                    'old_values' => ['string'],
                    'new_values' => ['string'],
                    'url' => ['string'],
                    'ip_address' => ['string'],
                    'user_agent' => ['string'],
                    'tags' => ['string'],
                ],
                // [],
            ],
            'update' => [
                [
                    'user_type' => ['string'],
                    'user_id' => ['string'],
                    'event' => ['string', 'required'],
                    'auditable_type' => ['string', 'required'],
                    'auditable_id' => ['string', 'required'],
                    'old_values' => ['string'],
                    'new_values' => ['string'],
                    'url' => ['string'],
                    'ip_address' => ['string'],
                    'user_agent' => ['string'],
                    'tags' => ['string'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
