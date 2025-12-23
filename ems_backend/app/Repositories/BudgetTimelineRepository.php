<?php

namespace App\Repositories;

use App\Models\BudgetTimeline;

class BudgetTimelineRepository extends BaseRepository 
{
    public function __construct(BudgetTimeline $model)
    {
        parent::__construct($model);
    }

}