<?php

namespace App\Repositories;

use App\Models\TransactionalLog;

class TransactionalLogRepository
{

    public function createFor(
         $model,
        array $data
    ): TransactionalLog {
        return $model->transactional_log()->create($data);
    }
}
