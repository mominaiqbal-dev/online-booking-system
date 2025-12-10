<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ContactController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/about', function () {
    return Inertia::render('About');
});

// Contact Page (UI + form submit)
Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

// contact POST endpoint (receives form submissions)
Route::post('/contact', [ContactController::class, 'store'])->name('contact.send');

use App\Http\Controllers\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

// Hotel Rooms Listing Page (Sarah's Port specific)
Route::get('/booking', function () {
    return Inertia::render('Booking', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('booking');

// All Hotels Page
Route::get('/hotels', function () {
    return Inertia::render('Hotels', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('hotels');

// Booking Form Page
Route::get('/booking-form', function () {
    return Inertia::render('BookingFormPage', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->middleware(['auth', 'verified'])->name('booking.form');

// Booking Submission
Route::post('/bookings', [BookingController::class, 'store'])->middleware(['auth', 'verified'])->name('bookings.store');



// Payment Routes
Route::get('/payment', [PaymentController::class, 'showPaymentForm'])->middleware(['auth', 'verified'])->name('payment.form');
Route::post('/process-payment', [PaymentController::class, 'processPayment'])->middleware(['auth', 'verified'])->name('payment.process');
Route::get('/payment/success/{booking_id?}', [PaymentController::class, 'paymentSuccess'])->middleware(['auth', 'verified'])->name('payment.success');
Route::post('/send-otp', [PaymentController::class, 'sendOTP'])->middleware(['auth', 'verified'])->name('payment.send-otp');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';