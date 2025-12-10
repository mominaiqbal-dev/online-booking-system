import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function Payment({ auth, booking }) {
    // Check if booking exists, if not show error
    if (!booking) {
        return (
            <>
                <Head title="Payment - Error" />
                <Header auth={auth} />
                <section className="payment-page">
                    <div className="container">
                        <div className="payment-wrapper">
                            <div className="payment-header">
                                <h1>Payment Error</h1>
                                <p>No booking found. Please create a booking first before proceeding to payment.</p>
                            </div>
                            <div className="payment-actions">
                                <button
                                    onClick={() => router.visit('/booking-form')}
                                    className="pay-now-btn"
                                >
                                    Create Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    // Debug: Log booking data
    console.log('Payment page booking data:', booking);

    const [paymentData, setPaymentData] = useState({
        payment_method: 'card',
        card_holder_name: '',
        card_number: '',
        expiry_date: '',
        cvv: '',
        mobile_number: '',
        otp: '',
        terms_accepted: false,
        amount: booking.room_price ? parseFloat(booking.room_price) : 3500,
        booking_id: booking.id
    });

    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        router.post('/process-payment', paymentData, {
            onSuccess: (page) => {
                setLoading(false);
                console.log('Payment success - redirecting to success page');
                // Inertia will handle the redirect automatically
            },
            onError: (errors) => {
                setLoading(false);
                console.error('Payment errors:', errors);
                if (errors.response && errors.response.data && errors.response.data.errors) {
                    alert('Validation errors: ' + JSON.stringify(errors.response.data.errors));
                } else if (errors.response && errors.response.data && errors.response.data.error) {
                    alert('Error: ' + errors.response.data.error);
                } else {
                    alert('Payment failed. Please try again.');
                }
            }
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSendOTP = async () => {
        if (!paymentData.mobile_number) {
            alert('Please enter mobile number first');
            return;
        }

        try {
            const response = await fetch('/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({
                    mobile_number: paymentData.mobile_number
                })
            });

            const data = await response.json();
            if (data.success) {
                setOtpSent(true);
                alert(`OTP sent: ${data.otp}`); // In real app, remove this alert
            }
        } catch (error) {
            alert('Failed to send OTP');
        }
    };

    const formatCardNumber = (value) => {
        return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    };

    const formatExpiryDate = (value) => {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    };

    return (
        <>
            <Head title="Payment - Smart Booking System" />
            
            <Header auth={auth} />

            {/* Payment Section */}
            <section className="payment-page">
                <div className="container">
                    <div className="payment-wrapper">
                        <div className="payment-header">
                            <h1>Payment Details</h1>
                            <p>Complete your booking by making payment</p>
                        </div>

                        <form onSubmit={handleSubmit} className="payment-form">
                            {/* Payment Method Selection */}
                            <div className="payment-method-section">
                                <h2>Select Payment Method</h2>
                                <div className="payment-methods">
                                    <label className="payment-method-card">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="card"
                                            checked={paymentData.payment_method === 'card'}
                                            onChange={handleChange}
                                        />
                                        <div className="method-content">
                                            <span className="method-icon">💳</span>
                                            <span className="method-name">Credit / Debit Card</span>
                                        </div>
                                    </label>

                                    <label className="payment-method-card">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="jazzcash"
                                            checked={paymentData.payment_method === 'jazzcash'}
                                            onChange={handleChange}
                                        />
                                        <div className="method-content">
                                            <span className="method-icon">📱</span>
                                            <span className="method-name">JazzCash</span>
                                        </div>
                                    </label>

                                    <label className="payment-method-card">
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="easypaisa"
                                            checked={paymentData.payment_method === 'easypaisa'}
                                            onChange={handleChange}
                                        />
                                        <div className="method-content">
                                            <span className="method-icon">📱</span>
                                            <span className="method-name">EasyPaisa</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Card Payment Details */}
                            {paymentData.payment_method === 'card' && (
                                <div className="card-details-section">
                                    <h2>Card Information</h2>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Card Holder Name</label>
                                            <input
                                                type="text"
                                                name="card_holder_name"
                                                value={paymentData.card_holder_name}
                                                onChange={handleChange}
                                                placeholder="Enter card holder name"
                                                required
                                                className="form-input"
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>Card Number</label>
                                            <input
                                                type="text"
                                                name="card_number"
                                                value={paymentData.card_number}
                                                onChange={(e) => setPaymentData(prev => ({
                                                    ...prev,
                                                    card_number: formatCardNumber(e.target.value)
                                                }))}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                                required
                                                className="form-input"
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Expiry Date (MM/YY)</label>
                                                <input
                                                    type="text"
                                                    name="expiry_date"
                                                    value={paymentData.expiry_date}
                                                    onChange={(e) => setPaymentData(prev => ({
                                                        ...prev,
                                                        expiry_date: formatExpiryDate(e.target.value)
                                                    }))}
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    required
                                                    className="form-input"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>CVV</label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={paymentData.cvv}
                                                    onChange={handleChange}
                                                    placeholder="123"
                                                    maxLength="3"
                                                    required
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Mobile Wallet Details */}
                            {(paymentData.payment_method === 'jazzcash' || paymentData.payment_method === 'easypaisa') && (
                                <div className="mobile-wallet-section">
                                    <h2>Mobile Wallet Details</h2>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Mobile Number</label>
                                            <input
                                                type="text"
                                                name="mobile_number"
                                                value={paymentData.mobile_number}
                                                onChange={handleChange}
                                                placeholder="03XX XXXXXXX"
                                                required
                                                className="form-input"
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Enter OTP</label>
                                                <input
                                                    type="text"
                                                    name="otp"
                                                    value={paymentData.otp}
                                                    onChange={handleChange}
                                                    placeholder="Enter OTP"
                                                    required
                                                    className="form-input"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>&nbsp;</label>
                                                <button
                                                    type="button"
                                                    className="otp-btn"
                                                    onClick={handleSendOTP}
                                                    disabled={!paymentData.mobile_number}
                                                >
                                                    Send OTP
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Amount Display */}
                            <div className="amount-section">
                                <h3>Total Amount</h3>
                                <div className="amount-display">
                                    <span className="amount">PKR {paymentData.amount}</span>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="terms-section">
                                <label className="terms-checkbox">
                                    <input
                                        type="checkbox"
                                        name="terms_accepted"
                                        checked={paymentData.terms_accepted}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span>I agree to the Terms & Conditions</span>
                                </label>
                            </div>

                            {/* Pay Now Button */}
                            <div className="payment-actions">
                                <button 
                                    type="submit" 
                                    className="pay-now-btn"
                                    disabled={loading || !paymentData.terms_accepted}
                                >
                                    {loading ? 'Processing...' : 'Pay Now'}
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