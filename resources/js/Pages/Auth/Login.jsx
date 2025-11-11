import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="auth-page">
            <Head title="Log in" />

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
                                <Link href={route('register')} className="signup-btn">Sign Up</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <div className="auth-container">
                <div className="auth-form-wrapper">
                    <div className="auth-header">
                        <h2>Login</h2>
                        <p>Welcome back! Please sign in to your account.</p>
                    </div>

                    {status && (
                        <div className="auth-status">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={errors.email ? 'error' : ''}
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="abc@gmail.com"
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
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                placeholder="**********"
                            />
                            {errors.password && <div className="error-message">{errors.password}</div>}
                        </div>

                        <div className="auth-options">
                            <div className="remember-me">
                                <input
                                    id="remember_me"
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label htmlFor="remember_me">Remember me</label>
                            </div>

                            {canResetPassword && (
                                <div className="forgot-password">
                                    <Link href={route('password.request')}>
                                        Forgot password?
                                    </Link>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="auth-btn" disabled={processing}>
                            {processing ? 'Logging in...' : 'Login'}
                        </button>

                        <div className="auth-links">
                            <p>Don't have an account? <Link href={route('register')}>Sign Up</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}