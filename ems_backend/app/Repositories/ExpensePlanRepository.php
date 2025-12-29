<?php

namespace App\Repositories;

use App\Models\ExpensePlan;

class ExpensePlanRepository extends BaseRepository 
{
    public function __construct(ExpensePlan $model)
    {
        parent::__construct($model);
    }

}