<?php

namespace App\Repositories;

use App\Models\ExpenseItem;

class ExpenseItemRepository extends BaseRepository 
{
    public function __construct(ExpenseItem $model)
    {
        parent::__construct($model);
    }
    

}