import React, { useState } from 'react';
import { Link, useForm, router } from '@inertiajs/react';

export default function Header({ auth }) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);

    // LOGIN FORM
    const {
        data: loginData,
        setData: setLoginData,
        post: loginPost,
        processing: loginProcessing,
        errors: loginErrors,
    } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleLogin = (e) => {
        e.preventDefault();
        loginPost(route('login'), {
            onSuccess: () => setShowLoginModal(false),
        });
    };

    // REGISTER FORM
    const {
        data: registerData,
        setData: setRegisterData,
        post: registerPost,
        processing: registerProcessing,
        errors: registerErrors,
    } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleRegister = (e) => {
        e.preventDefault();
        registerPost(route('register'), {
            onSuccess: () => setShowSignupModal(false),
        });
    };

    // ✅ FIXED LOGOUT FUNCTION
    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
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

    return (
        <>
            {/* ======== HEADER ======== */}
            <header className="header">
                <div className="container">
                    <div className="logo">
                        <h1>Smart Booking for Government<br />Hostels & Guest Houses</h1>
                    </div>
                    <nav className="navbar">
                        <ul>
                            <li><Link href="/">Home</Link></li>
                           <li><Link href="/hotels">Hotels</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            {auth.user ? (
                                <>
                                    <li>
                                        <Link href={route('dashboard')} className="login-btn">Dashboard</Link>
                                    </li>
                                    <li>
                                        {/* ✅ FIXED LOGOUT BUTTON */}
                                        <button 
                                            onClick={handleLogout} 
                                            className="logout-btn"
                                            type="button"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <button className="login-btn" onClick={() => setShowLoginModal(true)}>Login</button>
                                    </li>
                                    <li>
                                        <button className="signup-btn" onClick={() => setShowSignupModal(true)}>Sign Up</button>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </header>

            {/* ======== LOGIN MODAL ======== */}
            {showLoginModal && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModals}>&times;</button>
                        <div className="auth-header">
                            <h2>Login</h2>
                            <p>Welcome back! Please sign in to your account.</p>
                        </div>

                        <form onSubmit={handleLogin} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={loginData.email}
                                    className={loginErrors.email ? 'error' : ''}
                                    autoComplete="username"
                                    onChange={(e) => setLoginData("email", e.target.value)}
                                    required
                                    placeholder="abc@gmail.com"
                                />
                                {loginErrors.email && <div className="error-message">{loginErrors.email}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={loginData.password}
                                    className={loginErrors.password ? 'error' : ''}
                                    autoComplete="current-password"
                                    onChange={(e) => setLoginData("password", e.target.value)}
                                    required
                                    placeholder="**********"
                                />
                                {loginErrors.password && <div className="error-message">{loginErrors.password}</div>}
                            </div>

                            <div className="terms-checkbox">
                                <input 
                                    id="remember_me" 
                                    type="checkbox" 
                                    name="remember"
                                    checked={loginData.remember}
                                    onChange={(e) => setLoginData("remember", e.target.checked)}
                                />
                                <label htmlFor="remember_me">Remember me</label>
                            </div>

                            <div className="forgot-password">
                                <Link href={route('password.request')}>
                                    Forgot password?
                                </Link>
                            </div>

                            <button type="submit" className="auth-btn" disabled={loginProcessing}>
                                {loginProcessing ? 'Logging in...' : 'Login'}
                            </button>

                            <div className="auth-links">
                                <p>Don't have an account? <a href="#" onClick={switchToSignup}>Sign Up</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======== SIGNUP MODAL ======== */}
            {showSignupModal && (
                <div className="modal-overlay" onClick={closeModals}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModals}>&times;</button>
                        <div className="auth-header">
                            <h2>Sign Up</h2>
                            <p>Create your account to get started</p>
                        </div>

                        <form onSubmit={handleRegister} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={registerData.name}
                                    className={registerErrors.name ? 'error' : ''}
                                    autoComplete="name"
                                    onChange={(e) => setRegisterData("name", e.target.value)}
                                    required
                                    placeholder="Full Name"
                                />
                                {registerErrors.name && <div className="error-message">{registerErrors.name}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={registerData.email}
                                    className={registerErrors.email ? 'error' : ''}
                                    autoComplete="username"
                                    onChange={(e) => setRegisterData("email", e.target.value)}
                                    required
                                    placeholder="Email Address"
                                />
                                {registerErrors.email && <div className="error-message">{registerErrors.email}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={registerData.password}
                                    className={registerErrors.password ? 'error' : ''}
                                    autoComplete="new-password"
                                    onChange={(e) => setRegisterData("password", e.target.value)}
                                    required
                                    placeholder="Enter Password"
                                />
                                {registerErrors.password && <div className="error-message">{registerErrors.password}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password_confirmation">Confirm Password</label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={registerData.password_confirmation}
                                    className={registerErrors.password_confirmation ? 'error' : ''}
                                    autoComplete="new-password"
                                    onChange={(e) => setRegisterData("password_confirmation", e.target.value)}
                                    required
                                    placeholder="Confirm Password"
                                />
                                {registerErrors.password_confirmation && <div className="error-message">{registerErrors.password_confirmation}</div>}
                            </div>

                            <div className="terms-checkbox">
                                <input id="terms" type="checkbox" name="terms" required />
                                <label htmlFor="terms">Agree with Terms and conditions</label>
                            </div>

                            <button type="submit" className="auth-btn" disabled={registerProcessing}>
                                {registerProcessing ? 'Registering...' : 'Sign Up'}
                            </button>

                            <div className="auth-links">
                                <p>Already have an account? <a href="#" onClick={switchToLogin}>Login</a></p>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}