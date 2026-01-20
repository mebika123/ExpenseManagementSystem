<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Contact extends Model
{
    protected $fillable = ['name', 'email', 'phone_no', 'code', 'pan_no', 'contact_type', 'department_id', 'location_id'];


    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class, 'contact_id', 'id');
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
    // public function users()
    // {
    //     return $this->hasMany(User::class, 'contact_users', 'contact_id', 'user_id');
    // }
    //  public function conatctUser(): HasOne
    // {
    //     return $this->hasOne(ContactUser::class);
    // }
    public function advances()
    {
        return $this->hasMany(Advance::class);
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }
}
