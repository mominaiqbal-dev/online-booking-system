<?php

//use Illuminate\Http\Request;
//use Illuminate\Support\Facades\Route;
//use App\Http\Controllers\BookingController;

//Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
   // return $request->user();
//});

//Route::middleware('auth:sanctum')->group(function () {
  //  Route::get('/user/bookings', [BookingController::class, 'getUserBookings']);
  //  Route::put('/bookings/{id}', [BookingController::class, 'update']);
  //  Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);
//});

use App\Http\Controllers\HostelController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/admin/login', [AuthController::class, 'login']);
Route::post('/admin/logout', [AuthController::class, 'logout']);

Route::apiResource('hostels', HostelController::class);
Route::apiResource('rooms', RoomController::class);
Route::get('/rooms/available/{hostel_id?}', [RoomController::class, 'availableRooms']);


// USER (protected)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']); // user create
    Route::get('/bookings/user', [BookingController::class, 'getUserBookings']);
    Route::patch('/bookings/{id}', [BookingController::class, 'update']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);
});

// ADMIN (protected + is_admin middleware)
//Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/bookings', [BookingController::class, 'adminBookings']);
    Route::post('/admin/bookings', [BookingController::class, 'adminStore']); // admin create
    Route::patch('/admin/bookings/{id}', [BookingController::class, 'adminUpdate']);
    Route::delete('/admin/bookings/{id}', [BookingController::class, 'adminDestroy']);
//});

Route::get('/payments', [PaymentController::class, 'getAllPayments']);
Route::get('/dashboard-stats', [DashboardController::class, 'stats']);



