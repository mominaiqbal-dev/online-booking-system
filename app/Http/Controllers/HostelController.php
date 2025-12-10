<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hostels;

class HostelController extends Controller
{
    public function index()
    {
        return response()->json(Hostels::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'location' => 'required|string',
            'contact' => 'required|string',
            'capacity' => 'required|numeric',
            'rating' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',

        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('hostels', 'public');
        }

        $hostel = Hostels::create($validated);
        return response()->json($hostel, 201);
    }

    public function show(Hostels $hostel)
    {
        return response()->json($hostel);
    }

    public function update(Request $request, Hostels $hostel)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'location' => 'required|string',
            'contact' => 'required|string',
            'capacity' => 'required|numeric',
            'rating' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:10240',

        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('hostels', 'public');
        }

        $hostel->update($validated);
        return response()->json($hostel);
    }

    public function destroy(Hostels $hostel)
    {
        $hostel->delete();
        return response()->json(['message' => 'Hostel deleted']);
    }
}
