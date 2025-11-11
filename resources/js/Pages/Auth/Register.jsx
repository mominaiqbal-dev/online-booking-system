import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="auth-page">
            <Head title="Register" />

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
                            <li>
                                <Link href={route('login')} className="login-btn">Login</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <div className="auth-container">
                <div className="auth-form-wrapper">
                    <div className="auth-header">
                        <h2>Sign Up</h2>
                        <p>Create your account to get started</p>
                    </div>

                    <form onSubmit={submit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className={errors.name ? 'error' : ''}
                                autoComplete="name"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                placeholder="Full Name"
                            />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={errors.email ? 'error' : ''}
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="Email Address"
                            />
                            {errors.email && <div className="error-message">{errors.email}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className={errors.password ? 'error' : ''}
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="Enter Password"
                            />
                            {errors.password && <div className="error-message">{errors.password}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_confirmation">Confirm Password</label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className={errors.password_confirmation ? 'error' : ''}
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                                placeholder="Confirm Password"
                            />
                            {errors.password_confirmation && <div className="error-message">{errors.password_confirmation}</div>}
                        </div>

                        <div className="terms-checkbox">
                            <input id="terms" type="checkbox" name="terms" required />
                            <label htmlFor="terms">Agree with Terms and conditions</label>
                        </div>

                        <button type="submit" className="auth-btn" disabled={processing}>
                            {processing ? 'Registering...' : 'Sign Up'}
                        </button>

                        <div className="auth-links">
                            <p>Already have an account? <Link href={route('login')}>Login</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}