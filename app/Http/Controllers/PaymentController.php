<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function showPaymentForm()
    {
        return inertia('Payment');
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
            'amount' => 'required|numeric|min:1'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            // Generate unique booking ID
            $bookingId = 'BK' . Str::random(8) . time();

            // Create payment record
            $payment = Payment::create([
                'booking_id' => $bookingId,
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

            return redirect()->route('payment.success')->with([
                'success' => 'Payment completed successfully!',
                'booking_id' => $bookingId
            ]);

        } catch (\Exception $e) {
            return back()->with('error', 'Payment failed. Please try again.');
        }
    }

    public function paymentSuccess()
    {
        return inertia('PaymentSuccess');
    }

    public function sendOTP(Request $request)
    {
        // Simulate OTP sending (in real app, integrate with SMS service)
        $otp = rand(1000, 9999);
        
        return response()->json([
            'success' => true,
            'otp' => $otp,
            'message' => 'OTP sent to your mobile number'
        ]);
    }
}