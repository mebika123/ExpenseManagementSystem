<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model

{
  protected $fillable = ['name', 'code'];

  public function contact()
  {
    return $this->hasMany(Contact::class);
  }
  public function budget()
  {
    return $this->hasMany(Budget::class);
  }
}
