<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\Hash;

class TestBookingSeeder extends Seeder
{
    public function run()
    {
        // Get first user ya create karo agar nahi hai
        $user = User::first();

        if (!$user) {
            $user = User::create([
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);
        }

        // Create booking without payment (should show in Pending Payments)
        $pendingBooking = Booking::create([
            'user_id' => $user->id,
            'full_name' => 'Test Pending Booking',
            'phone_number' => '1234567890',
            'email' => 'test@example.com',
            'check_in_date' => now()->addDays(5),
            'check_out_date' => now()->addDays(7),
            'number_of_guests' => 2,
            'room_type' => 'single',
            'hostel_name' => 'Test Hostel',
            'hostel_location' => 'Test Location',
            'room_price' => 100.00,
            'status' => 'pending'
        ]);

        // Create booking with completed payment (should show in Confirmed Bookings)
        $confirmedBooking = Booking::create([
            'user_id' => $user->id,
            'full_name' => 'Test Confirmed Booking',
            'phone_number' => '1234567891',
            'email' => 'test2@example.com',
            'check_in_date' => now()->addDays(10),
            'check_out_date' => now()->addDays(12),
            'number_of_guests' => 3,
            'room_type' => 'double',
            'hostel_name' => 'Test Hostel 2',
            'hostel_location' => 'Test Location 2',
            'room_price' => 150.00,
            'status' => 'confirmed'
        ]);

        // Add completed payment to confirmed booking
        Payment::create([
            'booking_id' => $confirmedBooking->id,
            'payment_method' => 'card',
            'card_holder_name' => 'Test User',
            'card_number' => '4111111111111111',
            'expiry_date' => '12/25',
            'cvv' => '123',
            'amount' => 150.00,
            'status' => 'completed',
            'terms_accepted' => true
        ]);

        $this->command->info('Test bookings created successfully!');
        $this->command->info('- 1 booking without payment (Pending Payments)');
        $this->command->info('- 1 booking with completed payment (Confirmed Bookings)');
    }
}