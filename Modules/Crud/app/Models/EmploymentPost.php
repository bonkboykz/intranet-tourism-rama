<?php

namespace Modules\Crud\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Modules\User\Models\User;
use Database\Factories\EmploymentPostFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class EmploymentPost extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi;

    protected $table = 'employment_posts';

    protected static function newFactory()
    {
        return EmploymentPostFactory::new();
    }

    protected $fillable = [
        'department_id',
        'business_post_id',
        'business_grade_id',
        'business_scheme_id',
        'user_id',
        'location',
        'order',
        'work_phone',
    ];

    protected $appends = [
        'fullGrade',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'department_id' => ['required', 'integer'],
                    'business_post_id' => ['required', 'integer'],
                    'business_grade_id' => ['required', 'integer'],
                    'business_scheme_id' => ['required', 'integer'],
                    'user_id' => ['required', 'integer'],
                    'location' => ['required', 'string'],
                    'order' => ['required', 'integer'],
                    'work_phone' => ['string'],
                ],
                // [],
            ],
            'update' => [
                [
                    'department_id' => ['required', 'integer'],
                    'business_post_id' => ['required', 'integer'],
                    'business_grade_id' => ['integer'],
                    'business_scheme_id' => ['integer'],
                    'user_id' => ['required', 'integer'],
                    'location' => ['string'],
                    'order' => ['required', 'integer'],
                    'work_phone' => ['string'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    public function getFullGradeAttribute()
    {
        $businessSchemeCode = $this->businessScheme ? $this->businessScheme->code : '';
        $businessGradeCode = $this->businessGrade ? $this->businessGrade->code : '';

        return "{$businessSchemeCode}{$businessGradeCode}";
    }

    public function businessGrade()
    {
        return $this->belongsTo(BusinessGrade::class);
    }

    public function businessPost()
    {
        return $this->belongsTo(BusinessPost::class);
    }

    public function businessUnit()
    {
        return $this->belongsTo(BusinessUnit::class);
    }

    public function businessScheme()
    {
        return $this->belongsTo(BusinessScheme::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function supervisors()
    {
        return $this->hasMany(Supervisor::class);
    }
}
