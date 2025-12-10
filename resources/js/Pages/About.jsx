import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function About({ auth }) {
    return (
        <>
            <Head title="About Us - Smart Booking System" />
            
            <Header auth={auth} />

            <section className="about-hero-image">
                <div className="container">
                    <img src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=350&q=80" alt="Pakistan Mountains" />
                </div>
            </section>

            <section className="our-story-section">
                <div className="container">
                    <div className="story-container">
                        <div className="story-box">
                            <h2>Our Story</h2>
                            <p>
                                Born from a passion for exploration and simplicity, StayEase started as a vision to make 
                                every stay more meaningful. Our goal is to connect explorers with authentic, comfortable, 
                                and affordable accommodations across Pakistan and beyond making each journey memorable 
                                and stress-free.
                            </p>
                            <p>
                                From family-run guest houses in scenic valleys to sleek hostels in vibrant cities. StayEase 
                                bridges travelers and hosts through design, technology, and trust.
                            </p>
                        </div>
                        <div className="story-image-box">
                            <img src="https://quaysidehotel.co.uk/wp-content/uploads/2022/09/Reasons-to-a-room-direct-with-hotel-over-booking-via-third-party-travel-agency.jpg" alt="Pakistan Landscape" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mission-vision-section">
                <div className="container">
                    <h2>Our Mission & Vision</h2>
                    <div className="mission-vision-cards">
                        <div className="mission-card">
                            <h3>Our Mission</h3>
                            <p>
                                To make travel accessible and enjoyable for everyone by providing a simple, safe, 
                                and affordable way to discover and book hostels and guest houses worldwide. We aim 
                                to empower local hosts and bring authentic cultural experiences to every traveler.
                            </p>
                        </div>
                        <div className="vision-card">
                            <h3>Our Vision</h3>
                            <p>
                                To become the leading and most trusted digital travel companion where every booking 
                                feels personal, every stay feels like home, and every journey begins with ease.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="promise-section">
                <div className="container">
                    <div className="promise-box">
                        <h2>Our Promise</h2>
                        <p>
                            StayEase is more than a platform it's your travel companion. Our promise is to make 
                            every booking smooth, every stay safe, and every journey extraordinary. With verified 
                            properties, transparent pricing, and 24/7 customer care, we've got you covered whenever 
                            you go.
                        </p>
                        <Link href="/contact" className="contact-us-btn">Contact Us</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}