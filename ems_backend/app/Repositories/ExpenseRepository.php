<?php

namespace App\Repositories;

use App\Models\Expense;

class ExpenseRepository extends BaseRepository 
{
    public function __construct(Expense $model)
    {
        parent::__construct($model);
    }

}