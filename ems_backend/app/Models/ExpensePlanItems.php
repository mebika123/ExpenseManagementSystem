<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpensePlanItems extends Model
{
    protected $fillable = ['name', 'description', 'amount', 'contact_id', 'expense_category_id', 'paid_by_id', 'department_id', 'location_id', 'expense_plan_id', 'budget_id'];
    public function expensePlan()
    {
        return $this->belongsTo(expensePlan::class,'expense_plan_id');
    }
    public function expense_categories()
    {
        return $this->belongsTo(ExpenseCategory::class, 'expense_category_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id');
    }

    public function budget()
    {
        return $this->belongsTo(Budget::class, 'budget_id');
    }

    public function contact()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }
    public function paidBy()
    {
        return $this->belongsTo(Contact::class, 'paid_by_id');
    }
}
