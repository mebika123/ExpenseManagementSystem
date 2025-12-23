<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Statuses extends Model
{   
        protected $fillable = ['status','comment','updated_by_id'];
     public function model()
    {
        return $this->morphTo();
    }
}