<?php

namespace Modules\Album\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Posts\Models\Post;
use Illuminate\Support\Str;

class Album extends Model
{
    use HasFactory;

    // Indicate that the primary key is a UUID
    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'description'];

    /**
     * Boot function to create a UUID when creating a new model instance.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    /**
     * The posts that belong to the album.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function posts()
    {
        return $this->belongsToMany(Post::class, 'album_post');
    }

    /**
     * Create a new factory instance for the model.
     *
     */
    protected static function newFactory()
    {
        // return AlbumFactory::new();
    }
}
