<?php

namespace Modules\Events\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Modules\User\Models\User;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Event extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi, HasUuids;

    protected $table = 'events';

    protected $fillable = [
        'title',
        'description',
        'venue',
        'url',
        'color',
        'start_at',
        'end_at',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'title' => ['string', 'required'],
                    'venue' => ['string'],
                    'url' => ['nullable', 'string'],
                    'description' => ['string'],
                    'color' => ['string'],
                    'start_at' => ['string', 'required'],
                    'end_at' => ['string', 'required'],
                ],
                // [],
            ],
            'update' => [
                [
                    'title' => ['string', 'required'],
                    'venue' => ['string'],
                    'description' => ['string'],
                    'url' => ['nullable', 'string'],
                    'color' => ['string'],
                    'start_at' => ['string', 'required'],
                    'end_at' => ['string', 'required'],
                ],
                // [],
            ],
            'invite' => [
                [
                    'users' => ['array', 'required'],
                    'users.*.id' => ['string', 'required'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    // TODO: missing relations
    public function attendances()
    {
        // return $this->hasManyThrough(User::class, EventInvitation::class);
        return $this->hasMany(EventAttendance::class);
    }

    // public function attendance()
    // {
    //     return $this->hasOneThrough(User::class, EventAttendance::class)->latestOfMany();
    // }
}
