import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Hotels({ auth, destination, check_in, check_out }) {
    const [favorites, setFavorites] = useState({});
    const [filters, setFilters] = useState({
        location: destination || '',
        checkIn: check_in || '',
        checkOut: check_out || ''
    });
    const [allHotels, setAllHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // REAL API FETCH - Same as Home page
    const fetchHotels = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Hotels page - Fetching from API...');
            
            const response = await fetch('http://127.0.0.1:8000/api/hostels');
            console.log('📡 Hotels API Response:', response.status);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Hotels API Data received:', data);
            
            if (!data || data.length === 0) {
                throw new Error('No hotels data received');
            }
            
            // Format API data for hotels page
            const formattedHotels = data.map(hostel => ({
                id: hostel.id,
                name: hostel.name,
                location: hostel.location,
                image: hostel.image ? `http://127.0.0.1:8000/storage/${hostel.image}` : "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
                rating: parseFloat(hostel.rating) || 4.0,
                price: `PKR ${(parseFloat(hostel.rating) * 1000).toLocaleString()}`,
                type: hostel.capacity > 3 ? "Hotel" : "Guest House",
                amenities: [], // ✅ EMPTY ARRAY - Free WiFi aur 24/7 Available hata diya
                capacity: hostel.capacity
            }));
            
            console.log('🎉 Hotels formatted:', formattedHotels);
            setAllHotels(formattedHotels);
            
        } catch (err) {
            console.error('❌ Hotels API Error:', err);
            setError('Failed to load hotels: ' + err.message);
            setAllHotels([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const toggleFavorite = (hostelId) => {
        setFavorites(prev => ({
            ...prev,
            [hostelId]: !prev[hostelId]
        }));
    };

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

    const filteredHotels = allHotels.filter(hotel => {
        if (filters.location && !hotel.location.toLowerCase().includes(filters.location.toLowerCase())) {
            return false;
        }
        return true;
    });

    const clearFilters = () => {
        setFilters({ location: '', checkIn: '', checkOut: '' });
    };

    if (loading) {
        return (
            <>
                <Head title="Hotels - Smart Booking System" />
                <Header auth={auth} />
                <div className="container mx-auto px-4 py-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading hotels from API...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Head title="Hotels - Smart Booking System" />
            
            <Header auth={auth} />

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-4">
                    <p><strong>Error:</strong> {error}</p>
                    <button 
                        onClick={fetchHotels}
                        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Success Message */}
            {!error && allHotels.length > 0 && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-4 mt-4">
                    <p><strong>Success!</strong> Showing {allHotels.length} real hotels from API</p>
                </div>
            )}

            {/* Hero Section */}
            <section className="hotels-hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>All Hotels & Guest Houses</h1>
                        <p>Discover amazing places to stay across Pakistan</p>
                    </div>
                </div>
            </section>

            {/* Simple Search Section - Top Center */}
            <section className="search-section">
                <div className="container">
                    <div className="search-wrapper">
                        <div className="search-box">
                            <div className="search-icon">🔍</div>
                            <input
                                type="text"
                                placeholder="Search hotels by location..."
                                value={filters.location}
                                onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))}
                                className="search-input"
                            />
                            {filters.location && (
                                <button
                                    className="clear-search"
                                    onClick={clearFilters}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Date Filters */}
                    {(filters.checkIn || filters.checkOut) && (
                        <div className="date-filters" style={{
                            marginTop: '15px',
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            {filters.checkIn && (
                                <div className="filter-tag" style={{
                                    background: '#e3f2fd',
                                    color: '#1976d2',
                                    padding: '5px 12px',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    Check-in: {new Date(filters.checkIn).toLocaleDateString()}
                                    <button
                                        onClick={() => setFilters(prev => ({...prev, checkIn: ''}))}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#1976d2',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            padding: '0',
                                            marginLeft: '5px'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                            {filters.checkOut && (
                                <div className="filter-tag" style={{
                                    background: '#e3f2fd',
                                    color: '#1976d2',
                                    padding: '5px 12px',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    Check-out: {new Date(filters.checkOut).toLocaleDateString()}
                                    <button
                                        onClick={() => setFilters(prev => ({...prev, checkOut: ''}))}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#1976d2',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            padding: '0',
                                            marginLeft: '5px'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Hotels Grid */}
            <section className="hotels-listing">
                <div className="container">
                    <div className="results-info">
                        <h2>Available Properties ({filteredHotels.length})</h2>
                        {filters.location && (
                            <p>Showing results for: <strong>"{filters.location}"</strong></p>
                        )}
                    </div>

                    <div className="hostels-grid">
                        {filteredHotels.map(hostel => (
                            <div key={hostel.id} className="hostel-card">
                                <div className="hostel-image">
                                    <img src={hostel.image} alt={hostel.name} />
                          
                                </div>
                                <div className="hostel-info">
                                    <h3>{hostel.name}</h3>
                                    <p className="location"> {hostel.location}</p>
                                    <div className="rating">
                                        <div className="stars">
                                            {renderStars(hostel.rating)}
                                        </div>
                                        <span className="rating-text">({hostel.rating})</span>
                                    </div>
                                    
                                    {/* ✅ AMENITIES SECTION HATA DIYA - Free WiFi aur 24/7 Available nahi dikhega */}
                                    
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

                    {filteredHotels.length === 0 && !loading && (
                        <div className="no-results">
                            <h3>No hotels found matching your search</h3>
                            <p>Try searching for a different location</p>
                            <button 
                                className="clear-search-btn"
                                onClick={clearFilters}
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}