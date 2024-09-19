<?php

namespace Modules\Department\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Attachable;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Database\Factories\DepartmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Settings\Models\DepartmentPreference;
use Modules\User\Models\User;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Department extends Model implements AuditableContract
{
    use Auditable, Authorizable, HasFactory, QueryableApi, Attachable;

    protected static function newFactory()
    {
        return DepartmentFactory::new();
    }

    protected $table = 'departments';

    protected $fillable = [
        'name',
        'banner',
        'description',
        'order',
    ];

    public static function rules($scenario = 'create')
    {
        $rules = [
            'create' => [
                [
                    'name' => ['string', 'required'],
                    'banner' => ['file'],
                    'description' => ['string', 'nullable'],
                    'order' => ['integer', 'nullable'],
                ],
                // [],
            ],
            'update' => [
                [
                    'name' => ['string', 'required'],
                    'banner' => ['file'],
                    'description' => ['string', 'nullable'],
                    'order' => ['integer', 'nullable'],
                ],
                // [],
            ],
        ];

        return $rules[$scenario];
    }

    public function preferences()
    {
        return $this->hasMany(DepartmentPreference::class);
    }

    public function employmentPosts()
    {
        return $this->hasMany(EmploymentPost::class, 'department_id');
    }

    public function admins()
    {
        return $this->belongsToMany(User::class, 'department_admins');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'employment_posts')
            ->withPivot('position');
    }
}
