<?php

namespace App\Repositories;

use App\Interfaces\HasStatus;
use App\Models\Statuses;

class StatusRepository
{
    public function createFor(
        HasStatus $model,
        array $data
    ): Statuses {
        return $model->statuses()->create($data);
    }

    public function latestFor(HasStatus $model): ?Statuses
    {
        return $model->statuses()
            ->latest('created_at')
            ->first();
    }
}
