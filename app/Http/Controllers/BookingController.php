<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fullName' => 'required|string|max:255',
            'phoneNumber' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'checkInDate' => 'required|date',
            'checkOutDate' => 'required|date|after:checkInDate',
            'numberOfGuests' => 'required|integer|min:1|max:10',
            'roomType' => 'required|string|max:255',
            'specialRequests' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            Booking::create([
                'full_name' => $request->fullName,
                'phone_number' => $request->phoneNumber,
                'email' => $request->email,
                'check_in_date' => $request->checkInDate,
                'check_out_date' => $request->checkOutDate,
                'number_of_guests' => $request->numberOfGuests,
                'room_type' => $request->roomType,
                'special_requests' => $request->specialRequests,
                'hostel_name' => $request->hostelName,
                'hostel_location' => $request->hostelLocation,
                'room_id' => $request->roomId,
                'room_price' => $request->roomPrice,
                'save_info' => $request->saveInfo ?? false,
            ]);

            return redirect()->back()->with('success', 'Booking confirmed successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error submitting booking. Please try again.');
        }
    }
}