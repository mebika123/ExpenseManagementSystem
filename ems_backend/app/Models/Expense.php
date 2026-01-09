<?php

namespace App\Models;

use App\Interfaces\HasStatus;
use App\Traits\HasStatusTrait;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model implements HasStatus
{
  use HasStatusTrait;

  protected $fillable = ['title', 'code', 'created_by_id', 'budget_timeline_id', 'expense_plan_id'];
  public function expense_items()
  {
    return $this->hasMany(ExpenseItem::class);
  }
  public function budgetTimeline()
  {
    return $this->belongsTo(BudgetTimeline::class);
  }
  public function  transactionalAttachments()
  {
    return $this->morphMany(TransactionalAttachment::class, 'model');
  }
  public function expensePlan()
{
    return $this->belongsTo(ExpensePlan::class);
}
}
