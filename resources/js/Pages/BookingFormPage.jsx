import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function BookingFormPage({ auth }) {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        roomType: '',
        specialRequests: '',
        saveInfo: false,
        hostelId: '',
        hostelName: '',
        hostelLocation: '',
        roomId: '',
        roomPrice: '',
    });

    const [customGuests, setCustomGuests] = useState('');
    const [hostels, setHostels] = useState([]);
    const [rooms, setRooms] = useState([]);

    // Fetch all hostels on mount
    useEffect(() => {
        fetch('/api/hostels')
            .then(res => res.json())
            .then(data => setHostels(data))
            .catch(err => console.error(err));
    }, []);

    // Fetch available rooms when hostel changes
    const handleHostelChange = (e) => {
        const hostelId = e.target.value;
        setFormData(prev => ({
            ...prev,
            hostelId: hostelId,
            roomId: '',
            hostelName: hostels.find(h => h.id == hostelId)?.name || '',
            hostelLocation: hostels.find(h => h.id == hostelId)?.location || '',
        }));

        if (hostelId) {
            fetch(`/api/rooms/available/${hostelId}`)
                .then(res => res.json())
                .then(data => setRooms(data))
                .catch(err => console.error(err));
        } else {
            setRooms([]);
        }
    };

    const handleRoomChange = (e) => {
        const roomId = e.target.value;
        const selectedRoom = rooms.find(r => r.id == roomId);

        if (selectedRoom) {
            setFormData(prev => ({
                ...prev,
                roomId: roomId,
                roomType: selectedRoom.room_type,
                roomPrice: selectedRoom.price,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                roomId: '',
                roomType: '',
                roomPrice: '',
            }));
        }
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalFormData = {
            ...formData,
            numberOfGuests: customGuests ? parseInt(customGuests) : formData.numberOfGuests
        };

        router.post('/bookings', finalFormData, {
            onSuccess: () => alert('Booking created successfully! Redirecting to payment...'),
            onError: (errors) => {
                console.error(errors);
                alert('Error submitting booking. Please try again.');
            }
        });
    };

    return (
        <>
            <Head title="Booking Form - Smart Booking System" />
            <Header auth={auth} />

            <section className="booking-form-page">
                <div className="container">
                    <div className="booking-form-wrapper">
                        <div className="booking-form-header-page">
                            <h1>Guest Information</h1>
                            <p>Please fill in your details to complete the booking</p>
                        </div>

                        <form onSubmit={handleSubmit} className="booking-form-page-form">

                            {/* Hostel Selection */}
                            <div className="form-section-page">
                                <div className="form-section-column-page">
                                    <div className="form-group-page">
                                        <h3>Select Hostel</h3>
                                        <select
                                            name="hostelId"
                                            value={formData.hostelId}
                                            onChange={handleHostelChange}
                                            required
                                            className="form-input-page"
                                        >
                                            <option value="">-- Select Hostel --</option>
                                            {hostels.map(h => (
                                                <option key={h.id} value={h.id}>{h.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group-page">
                                        <h3>Hostel Location</h3>
                                        <input
                                            type="text"
                                            name="hostelLocation"
                                            value={formData.hostelLocation}
                                            readOnly
                                            className="form-input-page"
                                        />
                                    </div>
                                </div>

                                <div className="form-section-column-page">
                                    <div className="form-group-page">
                                        <h3>Select Room</h3>
                                        <select
                                            name="roomId"
                                            value={formData.roomId}
                                            onChange={handleRoomChange}
                                            required
                                            disabled={!rooms.length}
                                            className="form-input-page"
                                        >
                                            <option value="">
                                                {rooms.length ? '-- Select Room --' : 'No available rooms'}
                                            </option>
                                            {rooms.map(r => (
                                                <option key={r.id} value={r.id}>
                                                    {r.room_type} - {r.room_no}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group-page">
                                        <h3>Room Price (PKR)</h3>
                                        <input
                                            type="number"
                                            name="roomPrice"
                                            value={formData.roomPrice}
                                            readOnly
                                            className="form-input-page"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Guest Information */}
                            <div className="form-section-page">
                                <div className="form-section-column-page">
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

                                <div className="form-section-column-page">
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

                            {/* Special Requests */}
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

                            {/* Save Info */}
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

                            {/* Form Buttons */}
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
