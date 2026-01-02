<?php

namespace App\Models;

use App\Interfaces\HasStatus;
use App\Traits\HasStatusTrait;
use Illuminate\Database\Eloquent\Model;

class Advance extends Model implements HasStatus
{
    use HasStatusTrait;
    protected $fillable = ['contact_id', 'amount', 'purpose', 'expense_plan_id'];
    public function contact()
    {
        return $this->belongsTo(Contact::class);
    }

    public function expensePlan()
    {
        return $this->belongsTo(ExpensePlan::class);
    }
}
