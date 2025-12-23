<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpenseCategory extends Model
{
    protected $fillable = ['title', 'code'];
    public function expense_items()
    {
        return $this->hasMany(ExpenseItem::class);
    }
}
