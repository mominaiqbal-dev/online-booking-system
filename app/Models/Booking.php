<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', // ? User ID add karo
        'full_name',
        'phone_number',
        'email',
        'check_in_date',
        'check_out_date',
        'number_of_guests',
        'room_type',
        'special_requests',
        'hostel_name',
        'hostel_location',
        'room_id',
        'room_price',
        'save_info',
        'status' // ? Status add karo
    ];

    // ? User relationship add karo
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
