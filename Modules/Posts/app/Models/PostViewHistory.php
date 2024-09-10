<?php

namespace Modules\Posts\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Modules\Posts\Models\Post;

class PostViewHistory extends Model
{
    use HasFactory;

    protected $fillable = ['post_id', 'user_id', 'viewed_at'];

    // Relationships
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
