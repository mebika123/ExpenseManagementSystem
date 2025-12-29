<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionalAttachment extends Model
{
    protected $fillable = ['path','filename'];
    public function model()
    {
        return $this->morphTo();
    }
}
