<?php

namespace App\Models;

use App\Models\Traits\QueryableApi;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory, QueryableApi;

    protected $fillable = ['user_id', 'request_type', 'details', 'status', 'action_at'];

    protected $casts = [
        'details' => 'array', // Cast details field to array
    ];

    // Relationship to the user who made the request
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A request can be linked to a notification
    public function notification()
    {
        return $this->hasOne(Notification::class);
    }


}
