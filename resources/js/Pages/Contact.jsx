import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Contact({ auth }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('contact.send'), {
            onSuccess: () => {
                reset('message');
            }
        });
    };

    return (
        <>
            <Head title="Contact Us - Smart Booking" />
            <Header auth={auth} />

            <section className="contact-hero-image">
                <img src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Contact Hero" />
                <div className="hero-overlay">
                    <div className="container">
                        <h1>Get in Touch</h1>
                        <p>We'd love to hear from you! Whether you have questions, feedback, or partnership requests — EasyGest is here for you.</p>
                    </div>
                </div>
            </section>

            <section className="contact-section">
                <div className="container contact-grid">
                    <div className="contact-main">
                        <div className="contact-form-card">
                            <h2>Contact Form</h2>
                            {flash && flash.success && (
                                <div className="alert success">{flash.success}</div>
                            )}

                            <form onSubmit={submit} className="contact-form">
                                <div className="form-group">
                                    <input 
                                        placeholder="Full Name" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)} 
                                        required 
                                    />
                                    {errors.name && <div className="error">{errors.name}</div>}
                                </div>

                                <div className="form-group">
                                    <input 
                                        type="email" 
                                        placeholder="Email Address"
                                        value={data.email} 
                                        onChange={e => setData('email', e.target.value)} 
                                        required 
                                    />
                                    {errors.email && <div className="error">{errors.email}</div>}
                                </div>

                                <div className="form-group">
                                    <input 
                                        placeholder="Subject"
                                        value={data.subject} 
                                        onChange={e => setData('subject', e.target.value)} 
                                    />
                                </div>

                                <div className="form-group">
                                    <textarea 
                                        placeholder="Write your message here..."
                                        value={data.message} 
                                        onChange={e => setData('message', e.target.value)} 
                                        required 
                                        rows={6} 
                                    />
                                    {errors.message && <div className="error">{errors.message}</div>}
                                </div>

                                <button 
                                    type="submit" 
                                    className="send-message-btn" 
                                    disabled={processing}
                                >
                                    {processing ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="contact-info-card">
                        <h3>Reach Us Directly</h3>
                        <p>Whether you're looking for information, booking or partnership opportunities - we're here to assist you.</p>

                        <div className="contact-details">
                            <div className="contact-item">
                                <span className="icon">📞</span>
                                <span>123456789</span>
                            </div>
                            <div className="contact-item">
                                <span className="icon">✉️</span>
                                <span>mominaiqbal421@gmail.com</span>
                            </div>
                            <div className="contact-item">
                                <span className="icon">📍</span>
                                <span>Mansehra, kpk Pakistan</span>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </section>

            <div className="map-box">
                <div className="map-wrapper">
                    <h3>Find Us On Map</h3>
                </div>
                <div className="map-container">
                    <iframe
                        title="map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26284.87114031522!2d73.18699185!3d34.3336056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38de3111951f3375%3A0x543c3b2e93c6c5d4!2sMansehra%2C%20Khyber%20Pakhtunkhwa%2C%20Pakistan!5e0!3m2!1sen!2s!4v1699003436757!5m2!1sen!2s"
                        width="100%"
                        height="280"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>

            <Footer />
        </>
    );
}