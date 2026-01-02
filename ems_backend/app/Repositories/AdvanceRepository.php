<?php

namespace App\Repositories;

use App\Models\Advance;

class AdvanceRepository extends BaseRepository 
{
    public function __construct(Advance $model)
    {
        parent::__construct($model);
    }

}