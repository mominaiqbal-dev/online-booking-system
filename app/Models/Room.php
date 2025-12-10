<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'hostel_id',
        'room_type',
        'room_no',
        'status',
        'price',
    ];

    public function hostel()
    {
        return $this->belongsTo(hostels::class);
    }

    public function bookings()
    {
        //return $this->hasMany(Booking::class);
    }
}
