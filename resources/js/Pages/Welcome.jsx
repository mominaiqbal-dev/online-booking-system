import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Welcome({ auth }) {
    const [favorites, setFavorites] = useState({});
    const [featuredHostels, setFeaturedHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchData, setSearchData] = useState({
        destination: '',
        checkIn: '',
        checkOut: ''
    });

    // REAL API FETCH for hotels
    const fetchHostels = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 REAL API FETCH starting...');
            
            const response = await fetch('/api/hostels');
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ REAL API DATA received:', data);
            
            if (!data || data.length === 0) {
                throw new Error('No data received from API');
            }
            
            // Format REAL API data
            const formattedHostels = data.map(hostel => ({
                id: hostel.id,
                name: hostel.name,
                location: hostel.location,
                image: hostel.image ? `/storage/${hostel.image}` : "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
                availability: hostel.availability || "Available", // ✅ API se availability aayegi
                rating: parseFloat(hostel.rating) || 4.0,
                description: hostel.description || "Comfortable accommodation with all basic amenities."
            }));
            
            console.log('🎉 REAL DATA formatted:', formattedHostels);
            setFeaturedHostels(formattedHostels);
            
        } catch (err) {
            console.error('❌ API FETCH FAILED:', err);
            setError('Failed to fetch data: ' + err.message);
            
            // Fallback to original static data
            setFeaturedHostels([
                {
                    id: 1,
                    name: "Heritage Guest House",
                    location: "Peshawar",
                    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
                    availability: "Available", // ✅ "24/7 Available" hata diya
                    rating: 4.5,
                    description: "Traditional guest house with modern amenities"
                },
                {
                    id: 2,
                    name: "Hotel City View Peshawar", 
                    location: "Peshawar",
                    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
                    availability: "Available", // ✅ "24/7 Available" hata diya
                    rating: 4.2,
                    description: "City center location with great views"
                },
                {
                    id: 3,
                    name: "Peshawar Serena Hotel",
                    location: "Peshawar", 
                    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
                    availability: "Available", // ✅ "24/7 Available" hata diya
                    rating: 4.8,
                    description: "Luxury hotel with premium facilities"
                },
                {
                    id: 4,
                    name: "Peshawar Barracks Hotel",
                    location: "Peshawar",
                    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
                    availability: "Available", // ✅ "24/7 Available" hata diya
                    rating: 4.3,
                    description: "Comfortable stay with essential services"
                },
                {
                    id: 5,
                    name: "Shelton Legacy Peshawar",
                    location: "Peshawar",
                    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
                    availability: "Available", // ✅ "24/7 Available" hata diya
                    rating: 4.6,
                    description: "Modern hotel with excellent service"
                },
                {
                    id: 6,
                    name: "Luxurious Haven in Hayatabad",
                    location: "Peshawar",
                    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
                    availability: "Available", // ✅ "24/7 Available" hata diya
                    rating: 4.7,
                    description: "Premium accommodation in prime location"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHostels();
    }, []);

    

    const toggleFavorite = (hostelId) => {
        setFavorites(prev => ({
            ...prev,
            [hostelId]: !prev[hostelId]
        }));
    };

    // ✅ WAPAS ORIGINAL RATING STARS FUNCTION
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="star">★</span>);
        }

        if (hasHalfStar) {
            stars.push(<span key="half" className="star">★</span>);
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star" style={{color: '#d1d5db'}}>★</span>);
        }

        return stars;
    };

    // Loading state
    if (loading) {
        return (
            <>
                <Head title="Smart Booking System" />
                <Header auth={auth} />
                <div className="container mx-auto px-4 py-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading hostels from API...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head title="Smart Booking System" />
            
            <Header auth={auth} />

            {/* Error Message */}
            {error && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mx-4 mt-4">
                    <p>{error}</p>
                    <button 
                        onClick={fetchHostels}
                        className="mt-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Success Message */}
            {!error && featuredHostels.length > 0 && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-4 mt-4">
                    <p><strong>Live Data!</strong> Showing real hostels from our network</p>
                </div>
            )}

            {/* HERO SECTION - Static */}
            <section className="hero" id="home">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h2>Where Every Stay<br />Feels Like Home.</h2>
                            <p>Affordable stays, trusted reviews,<br />and easy booking.</p>
                            
                            <div className="search-form">
                                <div className="search-input">
                                    <input
                                        type="text"
                                        placeholder="City Or Destination"
                                        value={searchData.destination}
                                        onChange={(e) => setSearchData(prev => ({...prev, destination: e.target.value}))}
                                    />
                                </div>
                                <div className="search-input">
                                    <input
                                        type="date"
                                        placeholder="Check In"
                                        value={searchData.checkIn}
                                        onChange={(e) => setSearchData(prev => ({...prev, checkIn: e.target.value}))}
                                    />
                                </div>
                                <div className="search-input">
                                    <input
                                        type="date"
                                        placeholder="Check Out"
                                        value={searchData.checkOut}
                                        onChange={(e) => setSearchData(prev => ({...prev, checkOut: e.target.value}))}
                                    />
                                </div>
                                <button
                                    className="search-btn"
                                    onClick={() => {
                                        if (searchData.destination || searchData.checkIn || searchData.checkOut) {
                                            router.get('/hotels', {
                                                destination: searchData.destination,
                                                check_in: searchData.checkIn,
                                                check_out: searchData.checkOut
                                            });
                                        } else {
                                            router.get('/hotels');
                                        }
                                    }}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="hero-image">
                            <img src="https://st2.depositphotos.com/3197629/6602/i/450/depositphotos_66020151-stock-photo-islamia-college-peshawar-pakistan.jpg" alt="Luxury Hotel" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED HOSTELS - Dynamic API Data */}
            <section className="featured-section">
                <div className="container">
                    <h2>Featured Hostels & Guest Houses</h2>
                    <div className="hostels-grid">
                        {featuredHostels.slice(0, 3).map(hostel => (
                            <div key={hostel.id} className="hostel-card">
                                <div className="hostel-image">
                                    <img src={hostel.image} alt={hostel.name} />
                                    <div className="availability-badge">{hostel.availability}</div>
                                    
                                </div>
                                <div className="hostel-info">
                                    <h3>{hostel.name}</h3>
                                    <p className="location">{hostel.location}</p>
                                    <div className="rating">
                                        <div className="stars">
                                            {/* ✅ WAPAS ORIGINAL STARS FUNCTION USE HO RAHA HAI */}
                                            {renderStars(hostel.rating)}
                                        </div>
                                        <span className="rating-text">({hostel.rating})</span>
                                    </div>
                                    <div className="card-buttons">
                                        <button 
                                            className="btn-details"
                                            onClick={() => router.get('/booking')}
                                        >
                                            View Details
                                        </button>
                                        <button 
                                            className="btn-booking"
                                            onClick={() => router.get('/booking-form')}
                                        >
                                            Booking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MORE HOSTELS - Dynamic API Data */}
            <section className="more-hostels-section">
                <div className="container">
                    <div className="hostels-grid">
                        {featuredHostels.slice(3, 6).map(hostel => (
                            <div key={hostel.id} className="hostel-card">
                                <div className="hostel-image">
                                    <img src={hostel.image} alt={hostel.name} />
                                    <div className="availability-badge">{hostel.availability}</div>
                                    <button 
                                        className={`favorite-star ${favorites[hostel.id] ? 'active' : ''}`}
                                        onClick={() => toggleFavorite(hostel.id)}
                                    >
                                        {favorites[hostel.id] ? '★' : '☆'}
                                    </button>
                                </div>
                                <div className="hostel-info">
                                    <h3>{hostel.name}</h3>
                                    <p className="location">{hostel.location}</p>
                                    <div className="rating">
                                        <div className="stars">
                                            {/* ✅ WAPAS ORIGINAL STARS FUNCTION USE HO RAHA HAI */}
                                            {renderStars(hostel.rating)}
                                        </div>
                                        <span className="rating-text">({hostel.rating})</span>
                                    </div>
                                    <div className="card-buttons">
                                        <button 
                                            className="btn-details"
                                            onClick={() => router.get('/booking')}
                                        >
                                            View Details
                                        </button>
                                        <button 
                                            className="btn-booking"
                                            onClick={() => router.get('/booking-form')}
                                        >
                                            Booking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION - Static */}
            <section className="features-section">
                <div className="container">
                    <h2>Main Features</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <h3>Secure & Reliable</h3>
                            <p>Book confidently through our safe and encrypted platform your privacy is our priority.</p>
                        </div>
                        <div className="feature-item">
                            <h3>Best Prices</h3>
                            <p>Affordable rates without hidden fees.</p>
                        </div>
                        <div className="feature-item">
                            <h3>24/7 Support</h3>
                            <p>We're here whenever you need help.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY US SECTION - Static */}
            <section className="why-us-section">
                <div className="container">
                    <h2>Why Us</h2>
                    <div className="why-us-content">
                        <div className="why-us-item">
                            <h3>Easy Booking, No Hassle</h3>
                            <p>Book your government hostel or guest house in Peshawar with just a few clicks simple, fast, and secure.</p>
                        </div>
                        <div className="why-us-item">
                            <h3>300M+ reviews from fellow travellers</h3>
                            <p>Get trusted information from guests like you</p>
                        </div>
                        <div className="why-us-item">
                            <h3>Explore Prime Locations Across Peshawar</h3>
                            <p>From University Town to Hayatabad, find hostels and guest houses in all major areas of Peshawar city.</p>
                        </div>
                        <div className="why-us-item">
                            <h3>2+ million properties</h3>
                            <p>Hotels, guest houses, apartments, and more...</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION - Static */}
            <section className="about-section">
                <div className="container">
                    <h2>About Us</h2>
                    <p>A smart and secure online platform for booking government hostels and guest houses in Peshawar. Simplifying official accommodation with verified listings, real-time availability, and easy reservations all in one place.</p>
                </div>
            </section>

            

            <Footer />
        </>
    );
}


