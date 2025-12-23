<?php

namespace App\Repositories;

use App\Models\Budget;

class BudgetRepository extends BaseRepository 
{
    public function __construct(Budget $model)
    {
        parent::__construct($model);
    }

}