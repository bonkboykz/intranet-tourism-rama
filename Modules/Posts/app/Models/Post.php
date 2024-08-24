<?php

namespace Modules\Posts\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Modules\User\Models\User;;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Traits\Attachable;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Post extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi, HasUuids, Attachable;

    protected $table = 'posts';

    protected $fillable = [
        'user_id',
        'type',
        'content',
        'title',
        'tag',
        'visibility',
        'pool_posting',
        // 'likes',
        // 'mentions',
        'event'
    ];
    protected $cast = [
        'likes' => 'array',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'user_id' => ['string', 'required'],
                    'type' => ['string', 'required'],
                    'content' => ['string'],
                    'title' => ['string'],
                    'tag' => ['string'],
                    'visibility' => ['string', 'required'],
                    'pool_posting' => ['string'],
                    'likes' => ['string'],
                    'mentions' => ['string'],
                    'accessibilities' => ['array'],
                    'event' => ['string'],
                ],
                // [],
            ],
            'update' => [
                [
                    'user_id' => ['string', 'required'],
                    'type' => ['string', 'required'],
                    'content' => ['string'],
                    'title' => ['string'],
                    'tag' => ['string'],
                    'visibility' => ['string'],
                    'pool_posting' => ['string'],
                    'likes' => ['string'],
                    'mentions' => ['string'],
                    'event' => ['string'],
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

    public function accessibilities()
    {
        return $this->hasMany(PostAccessibility::class);
    }

    public function comments()
    {
        return $this->hasMany(PostComment::class);
    }
}
