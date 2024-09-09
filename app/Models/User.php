<?php

namespace App\Models;

use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Modules\Communities\Models\CommunityMember;
use Modules\Department\Models\EmploymentPost;
use Modules\Events\Models\EventAttendance;
use Modules\Posts\Models\Post;
use Modules\Profile\Models\Invitation;
use Modules\Profile\Models\Profile;
use Modules\Resources\Models\Resource;
use Modules\Resources\Models\ResourceAccess;
use Modules\Settings\Models\UserPreference;
use Spatie\Permission\Traits\HasPermissions;
use Spatie\Permission\Traits\HasRoles;


use BaconQrCode\Renderer\Color\Rgb;
use BaconQrCode\Renderer\Image\SvgImageBackEnd;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\RendererStyle\Fill;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Astrotomic\Vcard\Properties\Email;
use Astrotomic\Vcard\Properties\Gender;
use Astrotomic\Vcard\Properties\Kind;
use Astrotomic\Vcard\Properties\Tel;
use Astrotomic\Vcard\Vcard;
use Carbon\Carbon;


class User extends Authenticatable implements MustVerifyEmail
{
    use Authorizable, HasFactory, QueryableApi, HasApiTokens, HasPermissions, HasRoles, Notifiable;


    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public static function rules($scenario = 'default')
    {
        $rules = [
            'default' => [
                [
                    'name' => 'required',
                    'email' => 'required',
                    'password' => 'required',
                ],
            ],
            'default' => [
                [
                    'name' => 'string',
                    'email' => 'email',
                ],
            ],
            'register' => [
                [
                    'name' => ['required', 'string', 'max:255'],
                    'email' => ['required', 'string', 'email', 'unique:users', 'max:255'],
                    'password' => ['required', 'confirmed'],
                ],
                [
                    'email.unique' => 'Emel telah berdaftar. Sila set semula kata laluan sekiranya anda terlupa kata laluan',
                ],
            ],
        ];

        return !empty($rules[$scenario]) ? $rules[$scenario] : $rules['default'];
    }


    public function communityMembers()
    {
        return $this->hasMany(CommunityMember::class);
    }

    public function employmentPost()
    {
        return $this->hasOne(EmploymentPost::class)->latestOfMany();
    }

    public function employmentPosts()
    {
        return $this->hasMany(EmploymentPost::class);
    }

    public function eventAttendances()
    {
        return $this->hasMany(EventAttendance::class);
    }

    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function resources()
    {
        return $this->hasMany(Resource::class);
    }

    public function resourceAccesses()
    {
        return $this->hasMany(ResourceAccess::class);
    }

    public function preferences()
    {
        return $this->hasMany(UserPreference::class);
    }

    public function getVcardAttribute($value)
    {

        $vcard = Vcard::make()
            ->kind(Kind::INDIVIDUAL)
            // ->gender(Gender::MALE)
            ->fullName($this->name)
            ->name($this->name)
            ->email($this->email)
            // ->email('john.smith@company.com', [Email::WORK, Email::INTERNET])
            ->tel($this->profile->phone_no ?? 0, [Tel::WORK, Tel::VOICE])
            ->bday(Carbon::parse($this->profile->dob))
            // ->adr('','','1600 Pennsylvania Ave NW', 'Washington', 'DC', '20500-0003', 'USA')
            // ->photo('data:image/jpeg;base64,'.base64_encode(file_get_contents(__DIR__.'/stubs/photo.jpg')))
            // ->title('V. P. Research and Development')
            // ->role('Excecutive')
            // ->org('Google', 'GMail Team', 'Spam Detection Squad')
            // ->member('john.smith@company.com', '550e8400-e29b-11d4-a716-446655440000')
            // ->note('Hello world')
        ;
        $svg = (new Writer(
            new ImageRenderer(
                new RendererStyle(192, 0, null, null, Fill::uniformColor(new Rgb(255, 255, 255), new Rgb(45, 55, 72))),
                new SvgImageBackEnd
            )
        ))->writeString($vcard);

        return trim(substr($svg, strpos($svg, "\n") + 1));


    }
}
