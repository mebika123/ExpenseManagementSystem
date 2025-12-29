<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionalLog extends Model
{
    protected $fillable = ['amount', 'payment_date', 'contact_id'];
    public function model()
    {
        return $this->morphTo();
    }
}
