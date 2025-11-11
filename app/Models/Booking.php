<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
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
        'save_info'
    ];
}