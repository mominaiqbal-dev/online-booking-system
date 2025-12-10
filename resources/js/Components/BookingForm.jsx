import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function BookingFormPage({ auth, room }) {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        roomType: room?.type || 'Single Room',
        specialRequests: '',
        saveInfo: false
    });

    const [customGuests, setCustomGuests] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const finalFormData = {
            ...formData,
            numberOfGuests: customGuests ? parseInt(customGuests) : formData.numberOfGuests,
            roomPrice: 3500 // Default price, can be made dynamic later
        };
        
        router.post('/bookings', finalFormData, {
            onSuccess: () => {
                alert('Booking confirmed successfully!');
                window.history.back();
            },
            onError: (errors) => {
                alert('Error submitting booking. Please try again.');
            }
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleGuestsChange = (e) => {
        const value = e.target.value;
        if (value === 'custom') {
            setCustomGuests('');
        } else {
            setCustomGuests('');
            setFormData(prev => ({
                ...prev,
                numberOfGuests: parseInt(value)
            }));
        }
    };

    return (
        <>
            <Head title="Booking Form - Smart Booking System" />
            
            <Header auth={auth} />

            {/* Main Form Section */}
            <section className="booking-form-page">
                <div className="container">
                    <div className="booking-form-wrapper">
                        <div className="booking-form-header-page">
                            <h1>Guest Information</h1>
                            <p>Please fill in your details to complete the booking</p>
                        </div>

                        <form onSubmit={handleSubmit} className="booking-form-page-form">
                            {/* Two Column Layout */}
                            <div className="form-section-page">
                                {/* Left Column */}
                                <div className="form-section-column-page">
                                    {/* Full Name */}
                                    <div className="form-group-page">
                                        <h3>Full Name</h3>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Full Name"
                                            required
                                            className="form-input-page"
                                        />
                                    </div>

                                    {/* Check-in & Check-out Dates - Side by Side */}
                                    <div className="form-row-page">
                                        <div className="form-group-page">
                                            <h3>Check-in Date</h3>
                                            <input
                                                type="date"
                                                name="checkInDate"
                                                value={formData.checkInDate}
                                                onChange={handleChange}
                                                required
                                                className="form-input-page"
                                            />
                                        </div>
                                        <div className="form-group-page">
                                            <h3>Check-out Date</h3>
                                            <input
                                                type="date"
                                                name="checkOutDate"
                                                value={formData.checkOutDate}
                                                onChange={handleChange}
                                                required
                                                className="form-input-page"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Address */}
                                    <div className="form-group-page">
                                        <h3>Email Address</h3>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Email Address"
                                            required
                                            className="form-input-page"
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="form-section-column-page">
                                    {/* Phone Number */}
                                    <div className="form-group-page">
                                        <h3>Phone Number</h3>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                            required
                                            className="form-input-page"
                                        />
                                    </div>

                                    {/* Room Type */}
                                    <div className="form-group-page">
                                        <h3>Select Room Type</h3>
                                        <select 
                                            name="roomType" 
                                            value={formData.roomType}
                                            onChange={handleChange}
                                            required
                                            className="form-input-page"
                                        >
                                            <option value="Single Room">Single Room</option>
                                            <option value="Double Room">Double Room</option>
                                            <option value="Sharing Room">Sharing Room</option>
                                        </select>
                                    </div>

                                    {/* Number of Guests */}
                                    <div className="form-group-page">
                                        <h3>Number of Guests</h3>
                                        <select 
                                            name="numberOfGuests"
                                            value={customGuests ? 'custom' : formData.numberOfGuests}
                                            onChange={handleGuestsChange}
                                            required
                                            className="form-input-page"
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="custom">More than 5</option>
                                        </select>
                                        {customGuests !== '' && (
                                            <input
                                                type="number"
                                                placeholder="Enter number of guests"
                                                value={customGuests}
                                                onChange={(e) => setCustomGuests(e.target.value)}
                                                min="6"
                                                max="20"
                                                className="custom-guests-input-page"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Special Requests - Full Width */}
                            <div className="special-requests-section-page">
                                <div className="form-group-page">
                                    <h3>Special Requests</h3>
                                    <textarea
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleChange}
                                        placeholder="Any Special Requests or Additional information?"
                                        rows="4"
                                        className="form-textarea-page"
                                    />
                                </div>
                            </div>

                            {/* Save Info Checkbox - Last me */}
                            <div className="save-info-section-page">
                                <label className="checkbox-label-page">
                                    <input
                                        type="checkbox"
                                        name="saveInfo"
                                        checked={formData.saveInfo}
                                        onChange={handleChange}
                                    />
                                    Save my info for next time.
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="form-actions-page">
                                <button 
                                    type="button" 
                                    className="back-btn-page"
                                    onClick={() => window.history.back()}
                                >
                                    Back
                                </button>
                                <button type="submit" className="confirm-booking-btn-page">
                                    Confirm Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}