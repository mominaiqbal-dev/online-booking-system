<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Booking store method called', ['user_id' => Auth::id(), 'data' => $request->all()]);
        
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
            Log::error('Booking validation failed', ['errors' => $validator->errors()]);
            return back()->withErrors($validator)->withInput();
        }

        try {
            Log::info('Creating booking in database');
            
            $bookingData = [
                'user_id' => Auth::id(),
                'full_name' => $request->fullName,
                'phone_number' => $request->phoneNumber,
                'email' => $request->email,
                'check_in_date' => $request->checkInDate,
                'check_out_date' => $request->checkOutDate,
                'number_of_guests' => $request->numberOfGuests,
                'room_type' => $request->roomType,
                'special_requests' => $request->specialRequests ?? '',
                'hostel_name' => $request->hostelName ?? 'Default Hotel',
                'hostel_location' => $request->hostelLocation ?? 'Default Location',
                'room_id' => $request->roomId ?? 1,
                'room_price' => $request->roomPrice ? (float) $request->roomPrice : 3500,
                'save_info' => $request->saveInfo ?? false,
                'status' => 'pending',
            ];

            Log::info('Booking data prepared', $bookingData);

            $booking = Booking::create($bookingData);
            
            Log::info('Booking created successfully', ['booking_id' => $booking->id]);

            return redirect()->route('payment.form', ['booking_id' => $booking->id])->with([
                'success' => 'Booking created successfully!',
                'booking_id' => $booking->id
            ]);

        } catch (\Exception $e) {
            Log::error('Booking creation failed', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Error submitting booking: ' . $e->getMessage());   
        }
    }

    public function getUserBookings()
    {
        $user_id = Auth::id();
        Log::info('Fetching bookings for user', ['user_id' => $user_id]);

        $bookings = Booking::where('user_id', $user_id)
                          ->orderBy('created_at', 'desc')
                          ->get();

        Log::info('Bookings found', ['count' => $bookings->count()]);

        return response()->json($bookings);
    }

    public function update(Request $request, $id)
    {
        Log::info('Booking update method called', ['booking_id' => $id, 'user_id' => Auth::id(), 'data' => $request->all()]);

        $booking = Booking::where('id', $id)->where('user_id', Auth::id())->first();

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'sometimes|required|string|max:255',
            'phone_number' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|max:255',
            'check_in_date' => 'sometimes|required|date',
            'check_out_date' => 'sometimes|required|date|after:check_in_date',
            'number_of_guests' => 'sometimes|required|integer|min:1|max:10',
            'room_type' => 'sometimes|required|string|max:255',
            'special_requests' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('Booking update validation failed', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $booking->update($request->only([
                'full_name', 'phone_number', 'email', 'check_in_date', 'check_out_date',
                'number_of_guests', 'room_type', 'special_requests'
            ]));

            Log::info('Booking updated successfully', ['booking_id' => $booking->id]);

            return response()->json($booking);
        } catch (\Exception $e) {
            Log::error('Booking update failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update booking'], 500);
        }
    }

    public function destroy($id)
    {
        Log::info('Booking delete method called', ['booking_id' => $id, 'user_id' => Auth::id()]);

        $booking = Booking::where('id', $id)->where('user_id', Auth::id())->first();

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        try {
            $booking->delete();
            Log::info('Booking deleted successfully', ['booking_id' => $id]);
            return response()->json(['message' => 'Booking deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Booking delete failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete booking'], 500);
        }
    }

    /**
     * ADMIN — Fetch all bookings
     */
    public function adminBookings()
    {
        Log::info('Admin fetching all bookings');

        $bookings = Booking::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'bookings' => $bookings
        ]);
    }

    /**
     * ADMIN — Create booking (admin interface)
     */
    public function adminStore(Request $request)
    {
        Log::info('Admin create booking', ['data' => $request->all()]);

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'number_of_guests' => 'required|integer|min:1|max:10',
            'room_type' => 'required|string|max:255',
            'hostel_name' => 'nullable|string|max:255',
            'hostel_location' => 'nullable|string|max:255',
            'room_price' => 'nullable|numeric',
            'status' => 'nullable|in:pending,confirmed,cancelled'
        ]);

        if ($validator->fails()) {
            Log::error('Admin create validation failed', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $booking = Booking::create([
                'user_id' => $request->user_id ?? null,
                'full_name' => $request->full_name,
                'phone_number' => $request->phone_number,
                'email' => $request->email,
                'check_in_date' => $request->check_in_date,
                'check_out_date' => $request->check_out_date,
                'number_of_guests' => $request->number_of_guests,
                'room_type' => $request->room_type,
                'special_requests' => $request->special_requests ?? '',
                'hostel_name' => $request->hostel_name ?? 'Default Hostel',
                'hostel_location' => $request->hostel_location ?? 'Default Location',
                'room_id' => $request->room_id ?? 1,
                'room_price' => $request->room_price ?? 3500,
                'save_info' => $request->save_info ?? false,
                'status' => $request->status ?? 'pending'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Booking created',
                'booking' => $booking
            ], 201);
        } catch (\Exception $e) {
            Log::error('Admin create failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to create booking'], 500);
        }
    }

    /**
     * ADMIN — Update any booking
     */
    public function adminUpdate(Request $request, $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'sometimes|string|max:255',
            'phone_number' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|max:255',
            'check_in_date' => 'sometimes|date',
            'check_out_date' => 'sometimes|date|after:check_in_date',
            'number_of_guests' => 'sometimes|integer|min:1|max:10',
            'room_type' => 'sometimes|string|max:255',
            'special_requests' => 'nullable|string',
            'hostel_name' => 'sometimes|string|max:255',
            'hostel_location' => 'sometimes|string|max:255',
            'room_price' => 'sometimes|numeric',
            'status' => 'sometimes|in:pending,confirmed,cancelled',
        ]);

        if ($validator->fails()) {
            Log::error('Admin update validation failed', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $booking->update($request->all());

            return response()->json([
                'success' => true,
                'booking' => $booking
            ]);
        } catch (\Exception $e) {
            Log::error('Admin update failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to update booking'], 500);
        }
    }

    /**
     * ADMIN — Delete any booking
     */
    public function adminDestroy($id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['error' => 'Booking not found'], 404);
        }

        try {
            $booking->delete();

            return response()->json([
                'success' => true,
                'message' => 'Booking deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Admin delete failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Failed to delete booking'], 500);
        }
    }
}
