<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'payment_method',
        'card_holder_name',
        'card_number',
        'expiry_date',
        'cvv',
        'mobile_number',
        'otp',
        'amount',
        'status',
        'terms_accepted'
    ];

    protected $casts = [
        'booking_id' => 'integer',
        'amount' => 'decimal:2',
        'terms_accepted' => 'boolean',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}