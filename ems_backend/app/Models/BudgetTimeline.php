<?php

namespace App\Models;

use App\Interfaces\HasStatus;
use App\Traits\HasStatusTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetTimeline extends Model implements HasStatus
{
    use HasStatusTrait,HasFactory;
    protected $fillable = ['name','code','start_at','end_at'];
    public function budget()
    {
        return $this->hasMany(Budget::class);
    }
}
