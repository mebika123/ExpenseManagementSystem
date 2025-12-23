<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $fillable = ['title','amount','budget_timeline_id','department_id','location_id'];
      public function budgetTimeline()
    {
        return $this->belongsTo(BudgetTimeline::class);
    }
}
