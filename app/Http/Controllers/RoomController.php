<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    // Get all rooms (with hostel)
    public function index()
    {
        $rooms = Room::with('hostel')->get();
        return response()->json($rooms);
    }

    // Store new room
    public function store(Request $request)
    {
        $validated = $request->validate([
            'hostel_id' => 'required|exists:hostels,id',
            'room_type' => 'required|string|max:255',
            'room_no' => 'required|string|unique:rooms,room_no',
            'status' => 'required|in:Available,Occupied,Maintenance',
            'price' => 'required|numeric|min:0',
        ]);

        $room = Room::create($validated);
        return response()->json($room, 201);
    }

    // Show single room
    public function show($id)
    {
        $room = Room::with('hostel', 'bookings')->findOrFail($id);
        return response()->json($room);
    }

    // Update room
    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'hostel_id' => 'required|exists:hostels,id',
            'room_type' => 'required|string|max:255',
            'room_no' => 'required|string|unique:rooms,room_no,' . $id,
            'status' => 'required|in:Available,Occupied,Maintenance',
            'price' => 'required|numeric|min:0',
        ]);

        $room->update($validated);
        return response()->json($room);
    }

    // Delete room
    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }


public function availableRooms($hostel_id = null)
{
    $query = \App\Models\Room::whereRaw("TRIM(LOWER(status)) = ?", ['available']);

    if ($hostel_id) {
        $query->where('hostel_id', $hostel_id);
    }

    $rooms = $query->get();
    \Log::info('Available Rooms:', $rooms->toArray());

    return response()->json($rooms);
}
}
