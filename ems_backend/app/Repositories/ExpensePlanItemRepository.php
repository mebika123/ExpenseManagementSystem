<?php 
namespace App\Repositories;

use App\Models\ExpensePlanItems;

class ExpensePlanItemRepository extends BaseRepository 
{
    public function __construct(ExpensePlanItems $model)
    {
        parent::__construct($model);
    }
    

}