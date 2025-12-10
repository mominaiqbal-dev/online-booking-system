import React from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function BookingConfirmed({ auth, booking, payment }) {
    // Generate unique transaction and receipt IDs if missing
    const transactionId = payment?.transaction_id || `TXN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const receiptId = payment?.receipt_id || `HBK-RCPT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    // Auto-adjust charges according to totalPaid
    const totalPaid = payment?.amount || booking?.room_price || 0;
    const serviceFee = payment?.service_fee || totalPaid * 0.06; // example: 6%
    const tax = payment?.tax_amount || totalPaid * 0.02; // example: 2%
    const roomCharges = totalPaid - (serviceFee + tax);

    const bookingData = {
        id: booking?.id,
        receiptId,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        guestName: booking?.full_name || auth?.user?.name || 'Guest',
        phone: booking?.phone_number || auth?.user?.phone || '-',
        email: booking?.email || auth?.user?.email || '-',
        hostelName: booking?.hostel_name || '-',
        roomNumber: booking?.room_id || '-',
        location: booking?.hostel_location || '-',
        roomType: booking?.room_type || '-',
        checkIn: booking?.check_in_date ? new Date(booking.check_in_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-',
        checkOut: booking?.check_out_date ? new Date(booking.check_out_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-',
        guests: booking?.number_of_guests ? `${booking.number_of_guests} Adult${booking.number_of_guests > 1 ? 's' : ''}` : '-',
        specialRequests: booking?.special_requests || 'None',
        paymentMethod: payment?.payment_method ? formatPaymentMethod(payment.payment_method) : '-',
        transactionId,
        paymentDate: payment?.created_at ? new Date(payment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-',
        roomCharges: `Rs ${formatAmount(roomCharges)}`,
        serviceFee: `Rs ${formatAmount(serviceFee)}`,
        tax: `Rs ${formatAmount(tax)}`,
        totalAmount: `Rs ${formatAmount(totalPaid)}`,
        status: payment?.status ? capitalize(payment.status) : 'Successful'
    };

    function formatPaymentMethod(method) {
        const methods = { card: 'Credit / Debit Card', jazzcash: 'JazzCash', easypaisa: 'EasyPaisa' };
        return methods[method] || method;
    }

    function capitalize(text) {
        return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
    }

    function formatAmount(amount) {
        return new Intl.NumberFormat().format(amount);
    }

    const printReceipt = () => {
        const printContent = `
            <html>
            <head>
                <title>Receipt - ${bookingData.receiptId}</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: auto; color: #1a1a1a; }
                    h2 { text-align: center; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    td, th { border: 1px solid #ddd; padding: 8px; }
                    th { background-color: #f4f4f4; text-align: left; }
                    .section { margin-bottom: 20px; }
                    .section-title { font-weight: 600; margin-bottom: 8px; }
                </style>
            </head>
            <body>
                <h2>HostelBook - Booking Receipt</h2>
                <div class="section">
                    <div class="section-title">Customer Information</div>
                    <p><strong>Name:</strong> ${bookingData.guestName}</p>
                    <p><strong>Phone:</strong> ${bookingData.phone}</p>
                    <p><strong>Email:</strong> ${bookingData.email}</p>
                </div>
                <div class="section">
                    <div class="section-title">Booking Information</div>
                    <p><strong>Hostel Name:</strong> ${bookingData.hostelName}</p>
                    <p><strong>Room Number:</strong> ${bookingData.roomNumber}</p>
                    <p><strong>Room Type:</strong> ${bookingData.roomType}</p>
                    <p><strong>Location:</strong> ${bookingData.location}</p>
                    <p><strong>Check-In:</strong> ${bookingData.checkIn}</p>
                    <p><strong>Check-Out:</strong> ${bookingData.checkOut}</p>
                    <p><strong>Guests:</strong> ${bookingData.guests}</p>
                    <p><strong>Special Requests:</strong> ${bookingData.specialRequests}</p>
                </div>
                <div class="section">
                    <div class="section-title">Payment Details</div>
                    <p><strong>Payment Method:</strong> ${bookingData.paymentMethod}</p>
                    <p><strong>Transaction ID:</strong> ${bookingData.transactionId}</p>
                    <p><strong>Payment Date:</strong> ${bookingData.paymentDate}</p>
                    <p><strong>Status:</strong> ${bookingData.status}</p>
                </div>
                <div class="section">
                    <div class="section-title">Cost Breakdown</div>
                    <table>
                        <tr><td>Room Charges</td><td>${bookingData.roomCharges}</td></tr>
                        <tr><td>Service Fee</td><td>${bookingData.serviceFee}</td></tr>
                        <tr><td>Tax</td><td>${bookingData.tax}</td></tr>
                        <tr><th>Total Paid</th><th>${bookingData.totalAmount}</th></tr>
                    </table>
                </div>
            </body>
            </html>
        `;
        const printWindow = window.open('', '_blank', 'width=800,height=1000');
        printWindow.document.write(printContent);
        printWindow.document.close();
    };

    return (
        <>
            <Head title="Booking Confirmed - HostelBook" />
            <Header auth={auth} />

            <section className="booking-confirmed-page">
                <div className="container">
                    <div className="confirmed-wrapper">
                        <div className="confirmed-header">
                            <h1>Booking Confirmed!</h1>
                            <p>Your stay has been successfully booked and payment received.</p>
                        </div>

                        <div className="divider"></div>

                        <div className="receipt-preview">
                            <div className="receipt-header">
                                <div className="company-name">HostelBook</div>
                                <div className="company-tagline">Your trusted travel partner</div>
                                <div className="receipt-meta">
                                    <span>Date: {bookingData.date}</span>
                                    <span>Receipt ID: {bookingData.receiptId}</span>
                                </div>
                            </div>

                            <div className="divider"></div>

                            <div className="receipt-section">
                                <h3>Customer Information</h3>
                                <div className="info-grid">
                                    <div className="info-item"><span className="info-label">Name</span><span className="info-value">{bookingData.guestName}</span></div>
                                    <div className="info-item"><span className="info-label">Phone</span><span className="info-value">{bookingData.phone}</span></div>
                                    <div className="info-item"><span className="info-label">Email</span><span className="info-value">{bookingData.email}</span></div>
                                </div>
                            </div>

                            <div className="divider"></div>

                            <div className="receipt-section">
                                <h3>Booking Information</h3>
                                <div className="info-grid">
                                    <div className="info-item"><span className="info-label">Hostel Name</span><span className="info-value">{bookingData.hostelName}</span></div>
                                    <div className="info-item"><span className="info-label">Room Number</span><span className="info-value">{bookingData.roomNumber}</span></div>
                                    <div className="info-item"><span className="info-label">Room Type</span><span className="info-value">{bookingData.roomType}</span></div>
                                    <div className="info-item"><span className="info-label">Location</span><span className="info-value">{bookingData.location}</span></div>
                                    <div className="info-item"><span className="info-label">Check-In</span><span className="info-value">{bookingData.checkIn}</span></div>
                                    <div className="info-item"><span className="info-label">Check-Out</span><span className="info-value">{bookingData.checkOut}</span></div>
                                    <div className="info-item"><span className="info-label">Guests</span><span className="info-value">{bookingData.guests}</span></div>
                                    <div className="info-item"><span className="info-label">Special Requests</span><span className="info-value">{bookingData.specialRequests}</span></div>
                                </div>
                            </div>

                            <div className="divider"></div>

                            <div className="receipt-section">
                                <h3>Payment Details</h3>
                                <div className="info-grid">
                                    <div className="info-item"><span className="info-label">Payment Method</span><span className="info-value">{bookingData.paymentMethod}</span></div>
                                    <div className="info-item"><span className="info-label">Transaction ID</span><span className="info-value">{bookingData.transactionId}</span></div>
                                    <div className="info-item"><span className="info-label">Payment Date</span><span className="info-value">{bookingData.paymentDate}</span></div>
                                    <div className="info-item"><span className="info-label">Status</span><span className="info-value status-success">{bookingData.status}</span></div>
                                </div>
                            </div>

                            <div className="divider"></div>

                            <div className="receipt-section">
                                <h3>Cost Breakdown</h3>
                                <div className="cost-breakdown">
                                    <div className="cost-item"><span>Room Charges</span><span>{bookingData.roomCharges}</span></div>
                                    <div className="cost-item"><span>Service Fee</span><span>{bookingData.serviceFee}</span></div>
                                    <div className="cost-item"><span>Tax</span><span>{bookingData.tax}</span></div>
                                    <div className="cost-item total"><span>Total Paid</span><span>{bookingData.totalAmount}</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="btn-download" onClick={() => printReceipt()}>Print Receipt</button>
                            <button className="btn-home" onClick={() => router.get('/')}>Go to Homepage</button>
                            <button className="btn-dashboard" onClick={() => router.get('/dashboard')}>View Dashboard</button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
                .booking-confirmed-page { padding: 40px 0; background-color: #f8f9fa; min-height: calc(100vh - 160px); }
                .container { max-width: 800px; margin: 0 auto; padding: 0 20px; }
                .confirmed-wrapper { background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; padding: 40px; }
                .confirmed-header { text-align: center; margin-bottom: 30px; }
                .confirmed-header h1 { color: #2e7d32; font-size: 32px; font-weight: 700; margin-bottom: 16px; }
                .confirmed-header p { color: #666; font-size: 16px; line-height: 1.6; max-width: 600px; margin: 0 auto; }
                .divider { height: 1px; background: #e5e7eb; margin: 25px 0; }
                .receipt-preview { font-family: 'Inter', sans-serif; color: #1a1a1a; }
                .receipt-header { text-align: center; margin-bottom: 20px; }
                .company-name { font-size: 28px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
                .company-tagline { font-size: 16px; color: #6b7280; font-weight: 400; margin-bottom: 20px; }
                .receipt-meta { display: flex; justify-content: space-between; font-size: 14px; color: #4b5563; }
                .receipt-section h3 { font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb; }
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 40px; }
                .info-item { display: flex; flex-direction: column; }
                .info-label { font-size: 14px; color: #6b7280; font-weight: 500; margin-bottom: 4px; }
                .info-value { font-size: 15px; color: #1a1a1a; font-weight: 500; }
                .status-success { color: #2e7d32; font-weight: 600; }
                .cost-breakdown { width: 100%; }
                .cost-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
                .cost-item.total { border-bottom: 2px solid #1a1a1a; font-weight: 700; font-size: 16px; }
                .action-buttons { display: flex; gap: 16px; justify-content: center; margin-top: 40px; flex-wrap: wrap; }
                .btn-download { padding: 12px 24px; background: #4a6cf7; color: white; border-radius: 6px; border: 2px solid #4a6cf7; cursor: pointer; font-size: 16px; font-weight: 500; }
                .btn-home, .btn-dashboard { padding: 12px 24px; background: white; color: #4a6cf7; border-radius: 6px; border: 2px solid #4a6cf7; cursor: pointer; font-size: 16px; font-weight: 500; }
                .btn-download:hover { background: #3a5bd9; border-color: #3a5bd9; }
                .btn-home:hover, .btn-dashboard:hover { background: #4a6cf7; color: white; }
                @media (max-width: 768px) {
                    .info-grid { grid-template-columns: 1fr; gap: 12px; }
                    .receipt-meta { flex-direction: column; gap: 8px; text-align: center; }
                    .action-buttons { flex-direction: column; align-items: center; }
                    .btn-download, .btn-home, .btn-dashboard { width: 100%; max-width: 250px; }
                }
            `}</style>
        </>
    );
}
