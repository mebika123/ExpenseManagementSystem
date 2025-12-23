<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpenseItem extends Model
{
    protected $fillable = ['name', 'description', 'amount', 'contact_id', 'expense_category_id', 'paid_by_id', 'department_id', 'location_id', 'expense_id', 'budget_id'];
    public function expense()
    {
        return $this->belongsTo(Expense::class);
    }
    public function expense_categories()
    {
        return $this->belongsTo(ExpenseCategory::class);
    }
}
