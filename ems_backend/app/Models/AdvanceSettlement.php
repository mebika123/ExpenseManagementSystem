<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class AdvanceSettlement extends Model
{
    protected $fillable = ['amount', 'settlement_date', 'contact_id', 'advance_id'];
    public function transactional_logs(): MorphMany
    {
        return $this->morphMany(TransactionalLog::class, 'model');
    }
    public function contacts()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }
    public function advance()
    {
        return $this->belongsTo(Advance::class, 'advance_id');
    }
}
