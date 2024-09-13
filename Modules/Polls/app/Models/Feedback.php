<?php

namespace Modules\Polls\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Polls\Models\Poll;
use Modules\User\Models\User;



class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';

    protected $fillable = [
        'poll_id',
        'user_id',
        'feedback_text'
    ];

    protected $guarded = [
        // Define the guarded fields here
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function poll()
    {
        return $this->belongsTo(related: Poll::class);
    }
}
