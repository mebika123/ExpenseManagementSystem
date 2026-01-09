<?php

namespace App\Models;

use App\Interfaces\HasStatus;
use App\Traits\HasStatusTrait;
use Illuminate\Database\Eloquent\Model;

class ExpensePlan extends Model implements HasStatus
{
  use HasStatusTrait;
  protected $fillable = ['title', 'purpose', 'code', 'user_id', 'budget_timeline_id', 'start_at', 'end_at'];
  public function expense_plan_items()
  {
    return $this->hasMany(ExpensePlanItems::class);
  }
  public function budgetTimeline()
  {
    return $this->belongsTo(BudgetTimeline::class);
  }
  public function  transactionalAttachments()
  {
    return $this->morphMany(TransactionalAttachment::class, 'model');
  }

  public function advances()
  {
    return $this->hasMany(Advance::class);
  }

  public function expenses()
  {
    return $this->hasOne(Expense::class);
  }
}
