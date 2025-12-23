<?php

namespace App\Models;

use App\Interfaces\HasStatus;
use App\Traits\HasStatusTrait;
use Illuminate\Database\Eloquent\Model;

class BudgetTimeline extends Model implements HasStatus
{
    use HasStatusTrait;
    protected $fillable = ['name','code','start_at','end_at'];
    public function budget()
    {
        return $this->hasMany(Budget::class);
    }
}
