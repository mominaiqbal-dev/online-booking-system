import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Booking({ auth, hostel = null }) {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // REAL API FETCH for rooms
    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Fetching rooms from API...');
            
            // Agar hostel ID mili hai toh uske rooms fetch karo, nahi toh sab rooms
            const endpoint = hostel && hostel.id 
                ? `http://127.0.0.1:8000/api/hostels/${hostel.id}/rooms`
                : 'http://127.0.0.1:8000/api/rooms';
            
            const response = await fetch(endpoint);
            console.log('📡 Rooms response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ ROOMS DATA received:', data);
            
            if (!data || data.length === 0) {
                throw new Error('No rooms data received from API');
            }
            
            // Format API data for rooms
            const formattedRooms = data.map(room => ({
                id: room.id,
                type: room.room_type || "Standard Room",
                description: room.description || "Comfortable and well-equipped room for your stay.",
                facilities: room.facilities ? room.facilities.split(',') : ["AC", "WiFi", "TV"],
                price: `PKR ${room.price || '0'}`,
                status: room.status || "Available",
                hostel_name: room.hostel_name || "Sarah's Port"
            }));
            
            console.log('🎉 ROOMS formatted:', formattedRooms);
            setRooms(formattedRooms);
            
        } catch (err) {
            console.error('❌ ROOMS FETCH FAILED:', err);
            setError('Failed to fetch rooms data: ' + err.message);
            
            // Fallback to static data
            setRooms([
                {
                    id: 1,
                    type: "Double Room",
                    description: "Designed for couples or two friends, the double room includes one queen-size bed, attached washroom, mini-fridge, and air conditioning for maximum comfort. Some rooms feature city-view balconies.",
                    facilities: ["Private bathroom", "toiletries", "wardrobe", "TV", "reading lamp", "AC"],
                    price: "PKR 3,500",
                    status: "Available",
                    hostel_name: "Sarah's Port"
                },
                {
                    id: 2,
                    type: "Double Room",
                    description: "Designed for couples or two friends, the double room includes one queen-size bed, attached washroom, mini-fridge, and air conditioning for maximum comfort. Some rooms feature city-view balconies.",
                    facilities: ["Balcony", "AC", "private washroom", "room service", "wardrobe"],
                    price: "PKR 5,000",
                    status: "Available",
                    hostel_name: "Sarah's Port"
                },
                {
                    id: 3,
                    type: "Sharing Room",
                    description: "Perfect for groups and backpackers. Includes 3 single beds, attached washroom, shared storage, and ventilation system. Affordable and ideal for social travelers.",
                    facilities: ["Shared space", "AC", "attached washroom", "locker area", "reading lights"],
                    price: "PKR 1,800",
                    status: "Available",
                    hostel_name: "Sarah's Port"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, [hostel]);

    const policies = [
        "Valid ID card/passport is required at check-in",
        "Pets are not allowed within hosted premises",
        "Smoking is strictly prohibited inside rooms",
        "Minimum age requirement for guests is 18 years",
        "Check-in time: 2:00 PM Check-out time: 12:00 PM",
        "Visitors are not allowed in guest rooms after 5:00 PM",
        "Free cancellation up to 24 hours before check-in",
        "Early check-in or late check-out is subject to availability"
    ];

    const amenities = [
        { name: "Lounge & TV Area", icon: "📺" },
        { name: "Restaurant & Café", icon: "☕" },
        { name: "Laundry & Ironing Service", icon: "👔" },
        { name: "Free High-Speed Wi-Fi", icon: "📶" },
        { name: "Air Conditioning in Every Room", icon: "❄️" },
        { name: "Sitting Area", icon: "🪑" },
        { name: "Security rooms", icon: "🔒" },
        { name: "Free Private Parking", icon: "🅿️" },
        { name: "Gym & Fitness Area", icon: "💪" },
        { name: "Non-smoking rooms", icon: "🚭" }
    ];

    const hotelImages = [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80"
    ];

    // Loading state
    if (loading) {
        return (
            <>
                <Head title="Hotel Rooms - Smart Booking System" />
                <Header auth={auth} />
                <div className="container mx-auto px-4 py-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading rooms from API...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head title="Hotel Rooms - Smart Booking System" />
            
            <Header auth={auth} />

            {/* Error Message */}
            {error && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mx-4 mt-4">
                    <p>{error}</p>
                    <button 
                        onClick={fetchRooms}
                        className="mt-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Success Message */}
            {!error && rooms.length > 0 && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-4 mt-4">
                    <p><strong>Live Data!</strong> Showing real rooms from our database</p>
                </div>
            )}

            {/* ❌ HOTEL HEADER SECTION HATA DIYA - Yeh woh section thi jisme "Sarah's Port" aur "Peshawar" dikh raha tha */}

            {/* ======== MAIN HOTEL IMAGE (Rectangle) ======== */}
            <section className="main-hotel-image">
                <div className="container">
                    <img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80" alt="Sarah's Port Hotel" />
                </div>
            </section>

            {/* ======== HOTEL GALLERY (Square Images) ======== */}
            <section className="hotel-gallery">
                <div className="container">
                    <div className="gallery-grid">
                        {hotelImages.map((image, index) => (
                            <div key={index} className="gallery-item">
                                <img src={image} alt={`Hotel view ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ======== PROPERTY DESCRIPTION ======== */}
            <section className="property-description">
                <div className="container">
                    <h2>About this property</h2>
                    <p>
                        {hostel ? hostel.description : `Peshawar Serena Hotel offers comfortable family rooms with air-conditioning, private bathrooms, 
                        work desks, minibars, and free toiletries. Guests can enjoy premium facilities including a fitness 
                        center, outdoor pool, lush gardens, and a steam room, with free on site parking and WiFi. The 
                        on-site restaurant serves delicious halal local and international cuisines with options for 
                        breakfast, brunch, lunch, dinner, and high tea often accompanied by live music. Conveniently 
                        located just 1 km from Bacha Khan International Airport, the hotel provides both comfort and 
                        accessibility for families and travelers alike.`}
                    </p>
                </div>
            </section>

            {/* ======== COMFORT & AMENITIES ======== */}
            <section className="amenities-section">
                <div className="container">
                    <h2>Comfort & Amenities</h2>
                    <div className="amenities-box">
                        <div className="amenities-grid">
                            {amenities.map((amenity, index) => (
                                <div key={index} className="amenity-item">
                                    <span className="amenity-icon">{amenity.icon}</span>
                                    <span className="amenity-name">{amenity.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== GUEST REVIEWS ======== */}
            <section className="guest-reviews-section">
                <div className="container">
                    <h2>Guest reviews</h2>
                    <div className="reviews-table">
                        <div className="review-table-row">
                            <div className="review-category-name">
                                <span className="review-category-icon">📊</span>
                                Guest Experience
                            </div>
                            <div className="review-category-rating">4.5</div>
                        </div>
                        <div className="review-table-row">
                            <div className="review-category-name">
                                <span className="review-category-icon">📊</span>
                                Faculty & Staff
                            </div>
                            <div className="review-category-rating">4.4</div>
                        </div>
                        <div className="review-table-row">
                            <div className="review-category-name">
                                <span className="review-category-icon">📊</span>
                                Comfort
                            </div>
                            <div className="review-category-rating">4.3</div>
                        </div>
                        <div className="review-table-row">
                            <div className="review-category-name">
                                <span className="review-category-icon">📊</span>
                                Security
                            </div>
                            <div className="review-category-rating">4.2</div>
                        </div>
                        <div className="review-table-row">
                            <div className="review-category-name">
                                <span className="review-category-icon">📊</span>
                                Cleanliness
                            </div>
                            <div className="review-category-rating">4.1</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ======== ROOM TYPES - DYNAMIC FROM API ======== */}
            <section className="room-types-section">
                <div className="container">
                    <h2>Available Room Types</h2>
                    
                    {rooms.map((room) => (
                        <div key={room.id} className="room-card">
                            <div className="room-details">
                                <div className="room-header">
                                    <h3>{room.type}</h3>
                                    <span className={`status-badge ${room.status.toLowerCase()}`}>
                                        {room.status}
                                    </span>
                                </div>
                                <p>{room.description}</p>
                                
                                <div className="facilities">
                                    <strong>Facilities:</strong> {room.facilities.join(', ')}.
                                </div>
                                
                                <div className="room-price">
                                    <strong>Price:</strong> {room.price} per night
                                </div>
                                
                                <button 
                                    className="booking-btn"
                                    onClick={() => router.get('/booking-form')}
                                    disabled={room.status !== "Available"}
                                >
                                    {room.status === "Available" ? "Book Now" : "Not Available"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ======== SHARING ROOM POLICIES ======== */}
            <section className="policies-section">
                <div className="container">
                    <div className="policies-card">
                        <h3>House Rules</h3>
                        <p className="room-subtitle">
                            Perfect for groups and backpackers. Includes 3 single beds, attached
                        </p>
                        
                        <div className="facilities-list">
                            <strong>Facilities:</strong> Shared space, AC, attached washroom, locker area, reading lights.
                        </div>
                        
                        <div className="policies-list">
                            {policies.map((policy, index) => (
                                <div key={index} className="policy-item">
                                    {policy}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}