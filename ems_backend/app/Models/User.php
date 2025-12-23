<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasRoles, HasFactory, Notifiable;


    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'contact_id',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    // public function contacts()
    // {
    //     return $this->belongsToMany(Contact::class, 'contact_users', 'user_id', 'contact_id');
    // }
    //  public function conatctUser(): HasOne
    // {
    //     return $this->hasOne(ContactUser::class);
    // }
    // public function contacts()
    // {
    //     return $this->belongsToMany(Contact::class, 'contact_users')
    //         ->withTimestamps()
    //         ->limit(1);
    // }
 
     public function contact()
    {
        return $this->belongsTo(Contact::class);
    }
}
