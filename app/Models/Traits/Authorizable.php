<?php

namespace App\Models\Traits;

use Illuminate\Support\Facades\Schema;
use Modules\User\Models\User;

trait Authorizable
{
    public function scopeAuthorized($query)
    {
        $this->authorizedByAuth($query);
        $this->authorizedByDepartment($query);
    }

    public function scopeAuthorizedByAuth($query)
    {
        if (!auth()->check()) {
            $query->where(false);
        }

        if (Schema::hasColumn($this->getTable(), 'user_id')) {
            $query->where('user_id', auth()->id());
        }
    }

    public function scopeAuthorizedByDepartment($query)
    {
        if (Schema::hasColumn($this->getTable(), 'user_id')) {
            $user = User::find(auth()->id());
            $query->where('department_id', $user->department_id);
        }
    }
}
