<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait UuidTrait
{
    // // Disable auto-incrementing and set key type
    // public $incrementing = false;
    // protected $keyType = 'string';

    // Boot function from Laravel
    protected static function bootUuidTrait()
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
