<?php

namespace App\Traits;

use App\Models\TransactionalLog;

trait TransactionalTrait
{
    public function transactional_log()
    {
        return $this->morphMany(TransactionalLog::class, 'model');
    }

}
