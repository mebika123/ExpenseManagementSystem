<?php

namespace App\Repositories;

use App\Models\TransactionalLog;
use Illuminate\Database\Eloquent\Model;

class TransactionalLogRepository extends BaseRepository
{


    public function __construct(TransactionalLog $model)
    {
        parent::__construct($model);
    }
    public function createFor(Model $model, array $data)
    {
        return $model->transactional_logs()->create($data);
    }
}
