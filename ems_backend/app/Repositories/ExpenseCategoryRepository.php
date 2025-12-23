<?php

namespace App\Repositories;

use App\Models\ExpenseCategory;

class ExpenseCategoryRepository extends BaseRepository
{
    public function __construct(ExpenseCategory $model)
    {
        parent::__construct($model);
    }

}