<?php

namespace Modules\Polls\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Crud\Models\User;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Response extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi, HasUuids;

    protected $table = 'responses';

    protected $fillable = [
        'user_id',
        'poll_id',
        'answers'
    ];

    protected $casts = [
        'answers' => 'array',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'user_id' => ['string', 'required'],
                    'poll_id' => ['string', 'required'],
                    'answers' => ['array', 'required'],
                ],
                // [],
            ],
            'update' => [
                [
                    'user_id' => ['string', 'required'],
                    'poll_id' => ['string', 'required'],
                    'answers' => ['array', 'required'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    public function poll()
    {
        return $this->belongsTo(Poll::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function answers()
    {
        // answers is a json column
        return collect($this->answers);
    }
}
