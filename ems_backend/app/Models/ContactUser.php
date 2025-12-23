<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ContactUser extends Model
{
    //  protected $table = 'contact_users';
    // protected $fillable = ['user_id', 'contact_id'];

    //  public function user()
    // {
    //     return $this->belongsTo(User::class, 'user_id');
    // }

    // public function contact()
    // {
    //     return $this->belongsTo(Contact::class, 'contact_id');
    // }
}
