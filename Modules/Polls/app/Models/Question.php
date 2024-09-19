<?php

namespace Modules\Polls\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Question extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi, HasUuids;

    protected $table = 'questions';

    protected $fillable = [
        'poll_id',
        'question_text',
        'question_type',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'poll_id' => ['string', 'required'],
                    'question_text' => ['string', 'required'],
                    'question_type' => ['string', 'required'],
                ],
                // [],
            ],
            'update' => [
                [
                    'poll_id' => ['string', 'required'],
                    'question_text' => ['string', 'required'],
                    'question_type' => ['string', 'required'],
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

    public function options()
    {
        return $this->hasMany(Option::class);
    }

    public function responses()
    {
        return $this->hasMany(Response::class);
    }
}
