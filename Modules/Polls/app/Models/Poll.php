<?php

namespace Modules\Polls\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Modules\Posts\Models\Post;
use Modules\User\Models\User;
use Illuminate\Support\Str;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Traits\Attachable;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Poll extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi, HasUuids, Attachable;

    protected $table = 'polls';

    // Indicate that the primary key is a UUID
    public $incrementing = false;
    protected $keyType = 'string';


    protected $fillable = [
        'user_id',
        'title',
        'description',
        'end_date',
        'post_id',
    ];

    /**
     * Boot function to create a UUID when creating a new model instance.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'user_id' => ['string', 'required'],
                    'title' => ['string'],
                    'description' => ['string'],
                    'end_date' => ['date', 'required'],

                ],
                // [],
            ],
            'update' => [
                [
                    'user_id' => ['string', 'required'],
                    'title' => ['string'],
                    'description' => ['string'],
                    'end_date' => ['date','required'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function question()
    {
        return $this->hasOne(Question::class);
    }

    public function responses()
    {
        return $this->hasMany(Response::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }
}
