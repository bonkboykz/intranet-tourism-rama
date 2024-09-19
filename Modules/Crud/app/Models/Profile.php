<?php

namespace Modules\Crud\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
// use Modules\User\Models\User;
use Database\Factories\ProfileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use Illuminate\Database\Eloquent\Factories\Factory;

class Profile extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi;

    protected $table = 'profiles';

    protected static function newFactory(): Factory
    {
        return ProfileFactory::new();
    }

    protected $fillable = [
        'user_id',
        'bio',
        'image',
        'cover_photo',
        'phone_no',
        'dob',
        'work_phone',
        'staff_image',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'user_id' => ['string', 'required'],
                    'bio' => ['string'],
                    'image' => ['string'],
                    'cover_photo' => ['string'],
                    'phone_no' => ['string'],
                    'dob' => ['string'],
                    'work_phone' => ['string'],
                    'staff_image' => ['file'],
                ],
                // [],
            ],
            'update' => [
                [
                    'user_id' => ['string', 'required'],
                    'bio' => ['string'],
                    'image' => ['string'],
                    'cover_photo' => ['string'],
                    'phone_no' => ['string'],
                    'dob' => ['string'],
                    'work_phone' => ['string'],
                    'staff_image' => ['file'],
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
}
