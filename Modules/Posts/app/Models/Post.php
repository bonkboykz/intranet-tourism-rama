<?php

namespace Modules\Posts\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Modules\Communities\Models\Community;
use Modules\Communities\Models\CommunityMember;
use Modules\Department\Models\Department;
use Modules\Resources\Models\Resource;
use Modules\User\Models\User;


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
        'mentions',
        'event',
        'department_id',
        'community_id',
        'announced',
        'post_as',
    ];
    protected $casts = [
        'likes' => 'array',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'user_id' => ['required'],
                    'type' => ['string'],
                    'content' => ['string'],
                    'title' => ['string'],
                    'tag' => ['string'],
                    'visibility' => ['string', 'required'],
                    'pool_posting' => ['string'],
                    'likes' => ['string'],
                    'mentions' => ['string'],
                    'accessibilities' => ['array'],
                    'event' => ['string'],
                    'department_id' => ['string'],
                    'community_id' => ['string'],
                    'announced' => ['boolean'],
                    'post_as' => ['string', 'nullable'],
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
                    'department_id' => ['string'],
                    'community_id' => ['string'],
                    'announced' => ['boolean'],
                    'post_as' => ['string', 'nullable'],
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

    // public function comments()
    // {
    //     return $this->belongsToMany(self::class, 'post_comment');
    // }

    public function comments()
    {
        return $this->belongsToMany(self::class, 'post_comment', 'post_id', 'comment_id');
    }

    public function viewHistories()
    {
        return $this->hasMany(PostViewHistory::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function community()
    {
        return $this->belongsTo(Community::class, 'community_id');
    }

    public function attachments()
    {
        return $this->morphMany(Resource::class, 'attachable');
    }
}
