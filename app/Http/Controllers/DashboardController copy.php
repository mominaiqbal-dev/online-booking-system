<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Hostels;
use App\Models\Room;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_bookings' => Booking::count(),
            'total_payments' => Payment::count(),
            'total_hostels'  => Hostels::count(),
            'total_rooms'    => Room::count(),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'completed_payments' => Payment::where('status', 'completed')->count(),
        ]);
    }
}
