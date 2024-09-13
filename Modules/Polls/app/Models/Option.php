<?php

namespace Modules\Polls\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Option extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi, HasUuids;

    protected $table = 'options';

    protected $fillable = [
        'question_id',
        'option_text',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'question_id' => ['string', 'required'],
                    'option_text' => ['string', 'required'],
                ],
                // [],
            ],
            'update' => [
                [
                    'question_id' => ['string', 'required'],
                    'option_text' => ['string', 'required'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    public function question()
    {
        return $this->belongsTo(Question::class);
    }


}
