<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpenseItem extends Model
{
    protected $fillable = ['name', 'description', 'amount', 'contact_id', 'expense_category_id', 'paid_by_id', 'department_id', 'location_id', 'expense_id', 'budget_id','expense_plan_item_id'];
    public function expense()
    {
        return $this->belongsTo(Expense::class);
    }
    public function expense_categories()
    {
        return $this->belongsTo(ExpenseCategory::class, 'expense_category_id');
    }

    public function department() {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function location() {
        return $this->belongsTo(Location::class, 'location_id');
    }

    public function budget() {
        return $this->belongsTo(Budget::class, 'budget_id');
    }

    public function contact() {
        return $this->belongsTo(Contact::class, 'contact_id');
    }
    public function paidBy() {
        return $this->belongsTo(Contact::class, 'paid_by_id');
    }
}
