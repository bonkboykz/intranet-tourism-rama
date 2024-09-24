<?php

namespace Modules\User\Models;

use App\Models\BaseModel as Model;
use App\Models\Traits\Authorizable;
use App\Models\Traits\QueryableApi;
use chillerlan\QRCode\Common\EccLevel;
use chillerlan\QRCode\Data\QRMatrix;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Modules\Communities\Models\Community;
use Modules\Communities\Models\CommunityMember;
use Modules\Department\Models\Department;
use Modules\Department\Models\EmploymentPost;
use Modules\Events\Models\EventAttendance;
use Modules\Polls\Models\Poll;
use Modules\Posts\Models\Post;
use Modules\Profile\Models\Invitation;
use Modules\Profile\Models\Profile;
use Modules\Resources\Models\Resource;
use Modules\Resources\Models\ResourceAccess;
use Modules\Settings\Models\UserPreference;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use Spatie\Permission\Traits\HasPermissions;
use Spatie\Permission\Traits\HasRoles;
use Symfony\Component\Console\Output\ConsoleOutput;

// use BaconQrCode\Renderer\Color\Rgb;
// use BaconQrCode\Renderer\Image\SvgImageBackEnd;
// use BaconQrCode\Renderer\ImageRenderer;
// use BaconQrCode\Renderer\RendererStyle\Fill;
// use BaconQrCode\Renderer\RendererStyle\RendererStyle;
// use BaconQrCode\Writer;
use Astrotomic\Vcard\Properties\Kind;
use Astrotomic\Vcard\Properties\Tel;
use Astrotomic\Vcard\Vcard;
use Illuminate\Foundation\Auth\User as Authenticatable;


class User extends Authenticatable implements AuditableContract
{
    use Auditable, HasFactory, HasApiTokens, Notifiable, HasRoles, HasPermissions;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
        'remember_token',
    ];

    protected $guard_name = 'web';

    public static function rules($scenario = 'create')
    {
        $rules = [
            'default' => [
                [
                    'name' => 'string',
                    'email' => 'email',
                ],
            ],
            'create' => [
                [
                    'name' => ['string', 'required'],
                    'email' => ['string', 'required'],
                    // 'email_verified_at' => ['string'],
                    'password' => ['string', 'required'],
                    // 'remember_token' => ['string'],
                ],
                // [],
            ],
            'update' => [
                [
                    'name' => ['string', 'required'],
                    'email' => ['string', 'required'],
                    'email_verified_at' => ['string'],
                    // 'password' => ['string', 'required'],
                    // 'remember_token' => ['string'],
                ],
                // [],
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

        return $rules[$scenario];
    }

    public function communityMembers()
    {
        return $this->hasMany(CommunityMember::class);
    }

    public function employmentPost()
    {
        return $this->hasOne(EmploymentPost::class)->latestOfMany();
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

    // public function profiles()
    // {
    //     return $this->hasMany(Profile::class);
    // }

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

    public function polls()
    {
        return $this->hasMany(Poll::class);
    }

    // public function communities()
    // {
    //     // get communities from communities member and leave only them
    //     return $this->hasManyThrough(Community::class, CommunityMember::class, 'user_id', 'id', 'id', 'community_id');
    // }

    public function receivesBroadcastNotificationsOn()
    {
        return 'users.' . $this->id;
    }

    // Relationship to communities through the community_members table
    public function communities()
    {
        return $this->belongsToMany(Community::class, 'community_members', 'user_id', 'community_id')
            ->withPivot('role');
    }

    // Relationship to employment posts
    public function employmentPosts()
    {
        return $this->hasMany(EmploymentPost::class, 'user_id');
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
            // ->bday(Carbon::parse($this->profile->dob))
            // ->adr('','','1600 Pennsylvania Ave NW', 'Washington', 'DC', '20500-0003', 'USA')
            // ->photo('data:image/jpeg;base64,'.base64_encode(file_get_contents(__DIR__.'/stubs/photo.jpg')))
            // ->title('V. P. Research and Development')
            // ->role('Excecutive')
            // ->org('Google', 'GMail Team', 'Spam Detection Squad')
            // ->member('john.smith@company.com', '550e8400-e29b-11d4-a716-446655440000')
            // ->note('Hello world')
        ;

        if ($this->employmentPost) {
            if ($this->employmentPost->businessPost) {
                $vcard->title($this->employmentPost->businessPost->title);
            }

            $departmentName = "";
            $businessUnitName = "";

            if ($this->employmentPost->department) {
                $departmentName = $this->employmentPost->department->name;
            }

            if ($this->employmentPost->businessUnit) {
                $businessUnitName = $this->employmentPost->businessUnit->name;
            }

            $vcard->org($departmentName, $businessUnitName);
        }

        $options = new QROptions([
            // 'version' => 5,
            'eccLevel' => EccLevel::H,
            'imageBase64' => true,
            'addLogoSpace' => true,
            'logoSpaceWidth' => 32,
            'logoSpaceHeight' => 32,
            'scale' => 6,
            'imageTransparent' => false,
            'drawCircularModules' => true,
            'circleRadius' => 0.45,
            'keepAsSquare' => [QRMatrix::M_FINDER, QRMatrix::M_FINDER_DOT],
            'outputType' => QRCode::OUTPUT_IMAGE_PNG
        ]);

        $svg = (new QRCode($options))->render(data: $vcard);

        // $svg = (new Writer(
        //     new ImageRenderer(
        //         new RendererStyle(192, 0, null, null, Fill::uniformColor(new Rgb(255, 255, 255), new Rgb(45, 55, 72))),
        //         new SvgImageBackEnd
        //     )
        // ))->writeString($vcard);

        return $svg;

        // return trim(substr($svg, strpos($svg, "\n") + 1));


    }


    public function adminDepartments()
    {
        return $this->belongsToMany(Department::class, 'department_admins');
    }

    public function adminCommunities()
    {
        return $this->belongsToMany(Community::class, 'community_admins');
    }
}
