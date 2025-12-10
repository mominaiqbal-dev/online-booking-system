<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Booking;
use App\Models\Payment;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Get ALL bookings for the user with payments
        $bookings = Booking::where('user_id', $user->id)
                    ->with('payments')
                    ->latest()
                    ->get();

        // Statistics calculation
        $totalBookings = $bookings->count();

        // Pending payments: bookings that have NO payments or pending payments
        $pendingPayments = $bookings->filter(function ($booking) {
            return $booking->payments->isEmpty() || 
                   $booking->payments->where('status', 'completed')->isEmpty();
        })->count();

        // Confirmed bookings: bookings that have completed payments
        $confirmedBookings = $bookings->filter(function ($booking) {
            return $booking->payments->where('status', 'completed')->isNotEmpty();
        })->count();

        // Completed payments: count of completed payment records
        $completedPayments = Payment::whereHas('booking', function($query) use ($user) {
                                $query->where('user_id', $user->id);
                            })
                            ->where('status', 'completed')
                            ->count();

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user,
            ],
            'stats' => [
                'totalBookings' => $totalBookings,
                'confirmedBookings' => $confirmedBookings,
                'pendingPayments' => $pendingPayments,
                'completedPayments' => $completedPayments,
            ],
            'bookings' => $bookings->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'full_name' => $booking->full_name,
                    'phone_number' => $booking->phone_number,
                    'email' => $booking->email,
                    'check_in_date' => $booking->check_in_date,
                    'check_out_date' => $booking->check_out_date,
                    'number_of_guests' => $booking->number_of_guests,
                    'room_type' => $booking->room_type,
                    'special_requests' => $booking->special_requests,
                    'hostel_name' => $booking->hostel_name,
                    'hostel_location' => $booking->hostel_location,
                    'room_price' => $booking->room_price,
                    'status' => $booking->status,
                    'has_payment' => $booking->payments->isNotEmpty(),
                    'payment_status' => $booking->payments->isNotEmpty() ? $booking->payments->first()->status : 'unpaid',
                    'created_at' => $booking->created_at->format('M d, Y h:i A'),
                ];
            })
        ]);
    }
}