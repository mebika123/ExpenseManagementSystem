<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionalLog extends Model
{
    protected $fillable = ['amount', 'payment_date', 'contact_id','isSettled'];
    
    public function model()
    {
        return $this->morphTo();
    }
    public function contacts()
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

}
