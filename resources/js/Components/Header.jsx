import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { auth } = usePage().props;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <header className="header" style={{ 
            background: '#ffffff', 
            padding: '15px 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000
        }}>
            <div className="container" style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Logo */}
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link href="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: '#000000',
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }}>
                        <span>Smart Booking System</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center' }}>
                    <ul style={{
                        display: 'flex',
                        listStyle: 'none',
                        gap: '30px',
                        alignItems: 'center',
                        margin: 0,
                        padding: 0
                    }}>
                        <li>
                            <Link href="/" style={{ 
                                textDecoration: 'none', 
                                color: '#374151',
                                fontWeight: '500',
                                fontSize: '16px',
                                transition: 'color 0.2s'
                            }} className="hover-text-blue">Home</Link>
                        </li>
                        <li>
                            <Link href="/hotels" style={{ 
                                textDecoration: 'none', 
                                color: '#374151',
                                fontWeight: '500',
                                fontSize: '16px',
                                transition: 'color 0.2s'
                            }} className="hover-text-blue">Hotels</Link>
                        </li>
                        <li>
                            <Link href="/about" style={{ 
                                textDecoration: 'none', 
                                color: '#374151',
                                fontWeight: '500',
                                fontSize: '16px',
                                transition: 'color 0.2s'
                            }} className="hover-text-blue">About Us</Link>
                        </li>
                        <li>
                            <Link href="/contact" style={{ 
                                textDecoration: 'none', 
                                color: '#374151',
                                fontWeight: '500',
                                fontSize: '16px',
                                transition: 'color 0.2s'
                            }} className="hover-text-blue">Contact</Link>
                        </li>
                        
                        {auth?.user ? (
                            <>
                                {/* Profile Link - Contact ke baad */}
                                <li>
                                    <Link href="/profile" style={{ 
                                        textDecoration: 'none', 
                                        color: '#374151',
                                        fontWeight: '500',
                                        fontSize: '16px',
                                        transition: 'color 0.2s'
                                    }} className="hover-text-blue">Profile</Link>
                                </li>
                                
                                {/* Dashboard Link - Profile ke baad */}
                                <li>
                                    <Link href="/dashboard" style={{ 
                                        textDecoration: 'none', 
                                        background: '#2563eb',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        fontWeight: '500',
                                        fontSize: '16px',
                                        transition: 'background 0.2s'
                                    }} className="hover-bg-blue">Dashboard</Link>
                                </li>
                                
                                {/* Logout Button */}
                                <li>
                                    <button 
                                        onClick={handleLogout}
                                        style={{ 
                                            background: '#dc2626',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '16px',
                                            transition: 'background 0.2s'
                                        }}
                                        className="hover-bg-red"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/login" style={{ 
                                        textDecoration: 'none', 
                                        color: '#374151',
                                        fontWeight: '500',
                                        fontSize: '16px',
                                        transition: 'color 0.2s'
                                    }} className="hover-text-blue">Login</Link>
                                </li>
                                <li>
                                    <Link href="/register" style={{ 
                                        textDecoration: 'none', 
                                        background: '#2563eb',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        fontWeight: '500',
                                        fontSize: '16px',
                                        transition: 'background 0.2s'
                                    }} className="hover-bg-blue">Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    className="mobile-menu-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        display: 'none',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px'
                    }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="mobile-nav" style={{
                    background: 'white',
                    borderTop: '1px solid #e5e7eb',
                    padding: '20px',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1001
                }}>
                    <ul style={{
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px'
                    }}>
                        <li>
                            <Link 
                                href="/" 
                                onClick={() => setIsMenuOpen(false)}
                                style={{ 
                                    textDecoration: 'none', 
                                    color: '#374151',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    display: 'block',
                                    padding: '12px 0',
                                    textAlign: 'center'
                                }}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/hotels"
                                onClick={() => setIsMenuOpen(false)}
                                style={{ 
                                    textDecoration: 'none', 
                                    color: '#374151',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    display: 'block',
                                    padding: '12px 0',
                                    textAlign: 'center'
                                }}
                            >
                                Hotels
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/about"
                                onClick={() => setIsMenuOpen(false)}
                                style={{ 
                                    textDecoration: 'none', 
                                    color: '#374151',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    display: 'block',
                                    padding: '12px 0',
                                    textAlign: 'center'
                                }}
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/contact"
                                onClick={() => setIsMenuOpen(false)}
                                style={{ 
                                    textDecoration: 'none', 
                                    color: '#374151',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                    display: 'block',
                                    padding: '12px 0',
                                    textAlign: 'center'
                                }}
                            >
                                Contact
                            </Link>
                        </li>
                        
                        {auth?.user ? (
                            <>
                                {/* Profile Link - Mobile */}
                                <li>
                                    <Link 
                                        href="/profile"
                                        onClick={() => setIsMenuOpen(false)}
                                        style={{ 
                                            textDecoration: 'none', 
                                            color: '#374151',
                                            fontWeight: '500',
                                            fontSize: '16px',
                                            display: 'block',
                                            padding: '12px 0',
                                            textAlign: 'center'
                                        }}
                                    >
                                        Profile
                                    </Link>
                                </li>
                                
                                {/* Dashboard Link - Mobile */}
                                <li>
                                    <Link 
                                        href="/dashboard"
                                        onClick={() => setIsMenuOpen(false)}
                                        style={{ 
                                            textDecoration: 'none', 
                                            background: '#2563eb',
                                            color: 'white',
                                            padding: '12px 16px',
                                            borderRadius: '6px',
                                            fontWeight: '500',
                                            fontSize: '16px',
                                            display: 'block',
                                            textAlign: 'center'
                                        }}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                
                                {/* Logout Button - Mobile */}
                                <li>
                                    <button 
                                        onClick={(e) => {
                                            setIsMenuOpen(false);
                                            handleLogout(e);
                                        }}
                                        style={{ 
                                            background: '#dc2626',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 16px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            fontSize: '16px',
                                            width: '100%'
                                        }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link 
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        style={{ 
                                            textDecoration: 'none', 
                                            color: '#374151',
                                            fontWeight: '500',
                                            fontSize: '16px',
                                            display: 'block',
                                            padding: '12px 0',
                                            textAlign: 'center',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        href="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        style={{ 
                                            textDecoration: 'none', 
                                            background: '#2563eb',
                                            color: 'white',
                                            padding: '12px 16px',
                                            borderRadius: '6px',
                                            fontWeight: '500',
                                            fontSize: '16px',
                                            display: 'block',
                                            textAlign: 'center'
                                        }}
                                    >
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}

            <style jsx>{`
                @media (max-width: 768px) {
                    .desktop-nav {
                        display: none !important;
                    }
                    
                    .mobile-menu-button {
                        display: block !important;
                    }
                    
                    .logo span {
                        font-size: 20px !important;
                    }
                }
                
                @media (min-width: 769px) {
                    .mobile-nav {
                        display: none !important;
                    }
                }
                
                .hover-text-blue:hover {
                    color: #2563eb !important;
                }
                
                .hover-bg-blue:hover {
                    background: #1d4ed8 !important;
                }
                
                .hover-bg-red:hover {
                    background: #b91c1c !important;
                }
            `}</style>
        </header>
    );
}