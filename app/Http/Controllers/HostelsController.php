<?php

namespace App\Http\Controllers;

use App\Models\Hostels;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HostelController extends Controller
{
    // 📋 List all hostels
    public function index()
    {
        return response()->json(hostels::withCount('rooms')->get(), 200);
    }

    // 🏠 Store a new hostel
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'contact' => 'nullable|string|max:50',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // now expects a real image
            'capacity' => 'required|integer|min:0',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        // 🖼️ Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('hostels', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $hostel = hostels::create($data);

        return response()->json($hostel, 201);
    }

    // ✏️ Update an existing hostel
    public function update(Request $request, $id)
    {
        $hostel = hostels::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'sometimes|required|string|max:255',
            'contact' => 'nullable|string|max:50',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'capacity' => 'nullable|integer|min:0',
            'rating' => 'nullable|numeric|min:0|max:5',
        ]);

        // 🖼️ Replace old image if a new one is uploaded
        if ($request->hasFile('image')) {
            // delete old image if exists
            if ($hostel->image && file_exists(public_path(parse_url($hostel->image, PHP_URL_PATH)))) {
                unlink(public_path(parse_url($hostel->image, PHP_URL_PATH)));
            }

            $path = $request->file('image')->store('hostels', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $hostel->update($data);

        return response()->json($hostel, 200);
    }

    // 🗑️ Delete a hostel
    public function destroy($id)
    {
        $hostel = hostels::findOrFail($id);

        // delete image file
        if ($hostel->image && file_exists(public_path(parse_url($hostel->image, PHP_URL_PATH)))) {
            unlink(public_path(parse_url($hostel->image, PHP_URL_PATH)));
        }

        $hostel->delete();

        return response()->json(['message' => 'Hostel deleted successfully']);
    }
}
