<?php

namespace App\Models;

use Illuminate\Notifications\DatabaseNotification as BaseNotification;

// use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Notification extends BaseNotification implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi;

    protected $table = 'notifications';

    protected $fillable = [
        'type',
        'notifiable_type',
        'notifiable_id',
        'data',
        'read_at',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'type' => ['string', 'required'],
                    'notifiable_type' => ['string', 'required'],
                    'notifiable_id' => ['string', 'required'],
                    'data' => ['string', 'required'],
                    'read_at' => ['nullable', 'date'],
                ],
                // [],
            ],
            'update' => [
                [
                    'type' => ['string', 'required'],
                    'notifiable_type' => ['string', 'required'],
                    'notifiable_id' => ['string', 'required'],
                    'data' => ['string', 'required'],
                    'read_at' => ['nullable', 'date'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    // Define the relationship to the Request model
    public function request()
    {
        return $this->belongsTo(Request::class, 'data->request_id'); // Accessing request_id from the data field
    }

    public function getRequestIdAttribute()
    {
        return $this->data['request_id'] ?? null;
    }
}
