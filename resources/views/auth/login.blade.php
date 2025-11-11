import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, csrf_token }) {
    const [favorites, setFavorites] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    const toggleFavorite = (hostelId) => {
        setFavorites(prev => ({
            ...prev,
            [hostelId]: !prev[hostelId]
        }));
    };

    const openLoginModal = () => {
        setShowLoginModal(true);
        setShowSignupModal(false);
    };

    const openSignupModal = () => {
        setShowSignupModal(true);
        setShowLoginModal(false);
    };

    const closeModals = () => {
        setShowLoginModal(false);
        setShowSignupModal(false);
    };

    const switchToSignup = (e) => {
        e.preventDefault();
        setShowLoginModal(false);
        setShowSignupModal(true);
    };

    const switchToLogin = (e) => {
        e.preventDefault();
        setShowSignupModal(false);
        setShowLoginModal(true);
    };

    const featuredHostels = [
        {
            id: 1,
            name: "Heritage Guest House",
            location: "Peshawar",
            image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
            availability: "24/7 Available",
            rating: 4.5
        },
        {
            id: 2,
            name: "Hotel City View Peshawar", 
            location: "Peshawar",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
            availability: "24/7 Available",
            rating: 4.2
        },
        {
            id: 3,
            name: "Peshawar Serena Hotel",
            location: "Peshawar", 
            image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
            availability: "24/7 Available",
            rating: 4.8
        },
        {
            id: 4,
            name: "Peshawar Barracks Hotel",
            location: "Peshawar",
            image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
            availability: "24/7 Available",
            rating: 4.3
        },
        {
            id: 5,
            name: "Shelton Legacy Peshawar",
            location: "Peshawar",
            image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
            availability: "24/7 Available",
            rating: 4.6
        },
        {
            id: 6,
            name: "Luxurious Haven in Hayatabad",
            location: "Peshawar",
            image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250&q=80",
            availability: "24/7 Available",
            rating: 4.7
        }
    ];

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

    return (
        <>
            <Head title="Smart Booking System" />
            
            <header className="header">
                <div className="container">
                    <div className="logo">
                        <h1>Smart Booking for Government<br />Hostels & Guest Houses</h1>
                    </div>
                    <nav className="navbar">
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><a href="#bookings">Bookings</a></li>
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#contact">Contact</a></li>
                            {auth.user ? (
                                <li>
                                    <Link href={route('dashboard')} className="login-btn">Dashboard</Link>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <button className="login-btn" onClick={openLoginModal}>Login</button>
                                    </li>
                                    <li>
                                        <button className="signup-btn" onClick={openSignupModal}>Sign Up</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>

            {showLoginModal && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="modal-content corner-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModals}>&times;</button>
                        <div className="auth-header">
                            <h2>Login</h2>
                            <p>Welcome back! Please sign in to your account.</p>
                        </div>

                        <form method="POST" action={route('login')} className="auth-form">
                            <input type="hidden" name="_token" value={csrf_token} />
                            
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    id="email" 
                                    type="email" 
                                    name="email" 
                                    required 
                                    autoComplete="username" 
                                    placeholder="abc@gmail.com" 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                    id="password" 
                                    type="password" 
                                    name="password" 
                                    required 
                                    autoComplete="current-password" 
                                    placeholder="**********" 
                                />
                            </div>

                            <div className="terms-checkbox">
                                <input id="remember_me" type="checkbox" name="remember" />
                                <label htmlFor="remember_me">Remember me</label>
                            </div>

                            <div className="forgot-password">
                                <Link href={route('password.request')}>
                                    Forgot password?
                                </Link>
                            </div>

                            <button type="submit" className="auth-btn">
                                Login
                            </button>

                            <div className="auth-links">
                                <p>Don't have an account? <a href="#" onClick={switchToSignup}>Sign Up</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showSignupModal && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="modal-content corner-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModals}>&times;</button>
                        <div className="auth-header">
                            <h2>Sign Up</h2>
                            <p>Create your account to get started</p>
                        </div>

                        <form method="POST" action={route('register')} className="auth-form">
                            <input type="hidden" name="_token" value={csrf_token} />
                            
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input 
                                    id="name" 
                                    type="text" 
                                    name="name" 
                                    required 
                                    autoComplete="name" 
                                    placeholder="Full Name" 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input 
                                    id="email" 
                                    type="email" 
                                    name="email" 
                                    required 
                                    autoComplete="username" 
                                    placeholder="Email Address" 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input 
                                    id="password" 
                                    type="password" 
                                    name="password" 
                                    required 
                                    autoComplete="new-password" 
                                    placeholder="Enter Password" 
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password_confirmation">Confirm Password</label>
                                <input 
                                    id="password_confirmation" 
                                    type="password" 
                                    name="password_confirmation" 
                                    required 
                                    autoComplete="new-password" 
                                    placeholder="Confirm Password" 
                                />
                            </div>

                            <div className="terms-checkbox">
                                <input id="terms" type="checkbox" name="terms" required />
                                <label htmlFor="terms">Agree with Terms and conditions</label>
                            </div>

                            <button type="submit" className="auth-btn">
                                Sign Up
                            </button>

                            <div className="auth-links">
                                <p>Already have an account? <a href="#" onClick={switchToLogin}>Login</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <section className="hero" id="home">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <h2>Where Every Stay<br />Feels Like Home.</h2>
                            <p>Affordable stays, trusted reviews,<br />and easy booking.</p>
                            
                            <div className="search-form">
                                <div className="search-input">
                                    <input type="text" placeholder="City Or Destination" />
                                </div>
                                <div className="search-input">
                                    <input type="text" placeholder="Check In" />
                                </div>
                                <div className="search-input">
                                    <input type="text" placeholder="Check Out" />
                                </div>
                                <button className="search-btn">Search</button>
                            </div>
                        </div>
                        <div className="hero-image">
                            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" alt="Luxury Hotel" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="featured-section">
                <div className="container">
                    <h2>Featured Hostels & Guest Houses</h2>
                    <div className="hostels-grid">
                        {featuredHostels.slice(0, 3).map(hostel => (
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
                                            {renderStars(hostel.rating)}
                                        </div>
                                        <span className="rating-text">({hostel.rating})</span>
                                    </div>
                                    <div className="card-buttons">
                                        <button className="btn-details">View Details</button>
                                        <button className="btn-booking">Booking</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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
                                            {renderStars(hostel.rating)}
                                        </div>
                                        <span className="rating-text">({hostel.rating})</span>
                                    </div>
                                    <div className="card-buttons">
                                        <button className="btn-details">View Details</button>
                                        <button className="btn-booking">Booking</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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

            <section className="about-section">
                <div className="container">
                    <h2>About Us</h2>
                    <p>A smart and secure online platform for booking government hostels and guest houses in Peshawar. Simplifying official accommodation with verified listings, real-time availability, and easy reservations all in one place.</p>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h4>Home</h4>
                            <ul>
                                <li><a href="#about">About Us</a></li>
                                <li><a href="#explore">Explore</a></li>
                                <li><a href="#privacy">Privacy Policy</a></li>
                                <li><a href="#terms">Terms & Conditions</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="#help">Help Center</a></li>
                                <li><a href="#faq">FAQs</a></li>
                                <li><a href="#access">Open Access Policy</a></li>
                                <li><a href="#privacy-terms">Privacy & Terms</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Contact</h4>
                            <ul>
                                <li>Email: mominaiqbal@gmail.com</li>
                                <li>Phone: 123456789</li>
                                <li>Follow Us: </li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>Powered by the Smart Online Booking System, connecting travelers with verified government hostels and guest houses across Peshawar.</p>
                        <p>Copyright © 2025 Smart Online Booking System™. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    );
}