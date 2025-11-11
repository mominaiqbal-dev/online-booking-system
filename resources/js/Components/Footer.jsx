import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h4>Home</h4>
                        <ul>
                            <li><Link href="/about">About Us</Link></li>
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
    );
}