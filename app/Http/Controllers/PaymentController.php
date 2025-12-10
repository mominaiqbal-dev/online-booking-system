<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function showPaymentForm(Request $request)
    {
        $bookingId = $request->query('booking_id');
        $booking = null;

        if ($bookingId) {
            $booking = Booking::where('id', $bookingId)
                ->where('user_id', Auth::id())
                ->first();
        }

        return Inertia::render('Payment', [
            'booking' => $booking
        ]);
    }

    public function processPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|string|in:card,jazzcash,easypaisa',
            'card_holder_name' => 'required_if:payment_method,card',
            'card_number' => 'required_if:payment_method,card',
            'expiry_date' => 'required_if:payment_method,card',
            'cvv' => 'required_if:payment_method,card',
            'mobile_number' => 'required_if:payment_method,jazzcash,easypaisa',
            'otp' => 'required_if:payment_method,jazzcash,easypaisa',
            'terms_accepted' => 'required|accepted',
            'amount' => 'required|numeric|min:1',
            'booking_id' => 'required|exists:bookings,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $booking = Booking::where('id', $request->booking_id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$booking) {
                return response()->json(['error' => 'Booking not found or access denied.'], 404);
            }

            $paymentSuccessful = true; // Simulating payment success

            if ($paymentSuccessful) {
                Payment::create([
                    'booking_id' => $booking->id,
                    'payment_method' => $request->payment_method,
                    'card_holder_name' => $request->card_holder_name,
                    'card_number' => $request->payment_method === 'card' ? substr($request->card_number, -4) : null,
                    'expiry_date' => $request->expiry_date,
                    'cvv' => $request->cvv,
                    'mobile_number' => $request->mobile_number,
                    'otp' => $request->otp,
                    'amount' => $request->amount,
                    'terms_accepted' => $request->terms_accepted,
                    'status' => 'completed'
                ]);

                // Update booking status to confirmed
                $booking->update(['status' => 'confirmed']);

                // Update room status to Occupied
                if ($booking->room_id) {
                    $room = Room::find($booking->room_id);
                    if ($room) {
                        $room->status = 'Occupied';
                        $room->save();
                    }
                }

                return redirect()->route('payment.success', $booking->id)->with([
                    'success' => 'Payment completed successfully!',
                    'booking_id' => $booking->id
                ]);
            }

            return response()->json(['error' => 'Payment failed. Please try again.'], 400);

        } catch (\Exception $e) {
            Log::error('Payment processing failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Payment failed. Please try again.'], 500);
        }
    }

    public function paymentSuccess($booking_id = null)
    {
        $booking = null;
        $payment = null;

        if ($booking_id) {
            $booking = Booking::find($booking_id);
            if ($booking) {
                $payment = Payment::where('booking_id', $booking_id)->first();
            }
        }

        return Inertia::render('PaymentSuccess', [
            'booking' => $booking,
            'payment' => $payment
        ]);
    }

    public function sendOTP(Request $request)
    {
        $otp = rand(1000, 9999);

        return response()->json([
            'success' => true,
            'otp' => $otp,
            'message' => 'OTP sent to your mobile number'
        ]);
    }

    public function getAllPayments()
    {
        $payments = Payment::with('booking')->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }
}
