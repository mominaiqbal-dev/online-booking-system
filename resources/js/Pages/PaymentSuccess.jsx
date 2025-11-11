import React from 'react';
import { Head, router } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

export default function BookingConfirmed({ auth, booking, payment }) {
    // Dynamic data from backend
    const bookingData = {
        id: booking?.id || 'HBK-239847',
        receiptId: payment?.receipt_id || `HBK-RCPT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        date: new Date(booking?.created_at || new Date()).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }),
        guestName: auth?.user?.name || 'ABC',
        phone: auth?.user?.phone || '+92 300 1234567',
        email: auth?.user?.email || 'xyz@example.com',
        address: auth?.user?.address || 'Peshawar, KPK, Pakistan',
        property: booking?.room?.name || 'Hill View Hostel',
        location: booking?.room?.location || 'Swat, Pakistan',
        checkIn: booking?.check_in ? new Date(booking.check_in).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }) : 'Oct 20, 2025',
        checkOut: booking?.check_out ? new Date(booking.check_out).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }) : 'Oct 23, 2025',
        totalNights: booking?.duration || 3,
        guests: `${booking?.guests || 2} Adults`,
        paymentMethod: payment?.payment_method ? formatPaymentMethod(payment.payment_method) : 'Credit / Debit Card',
        transactionId: payment?.transaction_id || 'TXN238974',
        paymentDate: payment?.created_at ? new Date(payment.created_at).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }) : new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }),
        roomCharges: `Rs ${calculateRoomCharges(booking) || '7,200'}`,
        serviceFee: `Rs ${payment?.service_fee || '500'}`,
        tax: `Rs ${payment?.tax_amount || '175'}`,
        totalAmount: `Rs ${payment?.amount ? formatAmount(payment.amount) : '7,875'}`,
        status: payment?.status ? formatStatus(payment.status) : 'Successful'
    };

    // Helper functions
    function formatPaymentMethod(method) {
        const methods = {
            'card': 'Credit / Debit Card',
            'jazzcash': 'JazzCash',
            'easypaisa': 'EasyPaisa'
        };
        return methods[method] || method;
    }

    function formatStatus(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

    function formatAmount(amount) {
        return new Intl.NumberFormat().format(amount);
    }

    function calculateRoomCharges(booking) {
        if (!booking || !booking.room || !booking.duration) return null;
        const roomPrice = booking.room.price_per_night || 2400;
        const total = roomPrice * booking.duration;
        return formatAmount(total);
    }

    const printReceipt = () => {
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>HostelBook Receipt - ${bookingData.id}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Inter', sans-serif;
                        background: white;
                        color: #1a1a1a;
                        line-height: 1.6;
                        padding: 30px;
                        max-width: 800px;
                        margin: 0 auto;
                    }
                    
                    .receipt-container {
                        background: white;
                        border-radius: 0;
                        box-shadow: none;
                    }
                    
                    .header-section {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #e5e7eb;
                    }
                    
                    .company-name {
                        font-size: 32px;
                        font-weight: 700;
                        color: #1a1a1a;
                        margin-bottom: 8px;
                        letter-spacing: -0.5px;
                    }
                    
                    .company-tagline {
                        font-size: 16px;
                        color: #6b7280;
                        font-weight: 400;
                        margin-bottom: 20px;
                    }
                    
                    .receipt-meta {
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                        color: #4b5563;
                    }
                    
                    .divider {
                        height: 1px;
                        background: #e5e7eb;
                        margin: 25px 0;
                    }
                    
                    .section {
                        margin-bottom: 30px;
                    }
                    
                    .section-title {
                        font-size: 18px;
                        font-weight: 600;
                        color: #1a1a1a;
                        margin-bottom: 20px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px 40px;
                    }
                    
                    .info-item {
                        display: flex;
                        flex-direction: column;
                    }
                    
                    .info-label {
                        font-size: 14px;
                        color: #6b7280;
                        font-weight: 500;
                        margin-bottom: 4px;
                    }
                    
                    .info-value {
                        font-size: 15px;
                        color: #1a1a1a;
                        font-weight: 500;
                    }
                    
                    .cost-breakdown {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    
                    .cost-breakdown tr {
                        border-bottom: 1px solid #f3f4f6;
                    }
                    
                    .cost-breakdown tr:last-child {
                        border-bottom: 2px solid #1a1a1a;
                        font-weight: 700;
                    }
                    
                    .cost-breakdown td {
                        padding: 12px 0;
                        font-size: 15px;
                    }
                    
                    .cost-breakdown td:last-child {
                        text-align: right;
                        font-weight: 500;
                    }
                    
                    .cost-breakdown tr:last-child td {
                        font-size: 16px;
                        color: #1a1a1a;
                    }
                    
                    .footer-section {
                        text-align: center;
                        margin-top: 40px;
                        padding-top: 30px;
                        border-top: 2px solid #e5e7eb;
                        color: #6b7280;
                        font-size: 14px;
                    }
                    
                    .action-buttons {
                        display: none;
                    }
                    
                    @media print {
                        body {
                            padding: 20px;
                        }
                        
                        .no-print {
                            display: none !important;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="receipt-container">
                    <div class="header-section">
                        <div class="company-name">HostelBook</div>
                        <div class="company-tagline">Your trusted travel partner</div>
                        <div class="receipt-meta">
                            <span>Date: ${bookingData.date}</span>
                            <span>Receipt ID: ${bookingData.receiptId}</span>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="section">
                        <div class="section-title">Customer Information</div>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Name</span>
                                <span class="info-value">${bookingData.guestName}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Phone</span>
                                <span class="info-value">${bookingData.phone}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Email</span>
                                <span class="info-value">${bookingData.email}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Address</span>
                                <span class="info-value">${bookingData.address}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="section">
                        <div class="section-title">Booking Information</div>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Booking ID</span>
                                <span class="info-value">${bookingData.id}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Location</span>
                                <span class="info-value">${bookingData.location}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Property</span>
                                <span class="info-value">${bookingData.property}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Check-In</span>
                                <span class="info-value">${bookingData.checkIn}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Nights</span>
                                <span class="info-value">${bookingData.totalNights}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Check-out</span>
                                <span class="info-value">${bookingData.checkOut}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Guests</span>
                                <span class="info-value">${bookingData.guests}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="section">
                        <div class="section-title">Payment Details</div>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Payment Method</span>
                                <span class="info-value">${bookingData.paymentMethod}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Transaction ID</span>
                                <span class="info-value">${bookingData.transactionId}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Payment Date</span>
                                <span class="info-value">${bookingData.paymentDate}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Status</span>
                                <span class="info-value">${bookingData.status}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="divider"></div>
                    
                    <div class="section">
                        <div class="section-title">Cost Breakdown</div>
                        <table class="cost-breakdown">
                            <tr>
                                <td>Room Charges (${bookingData.totalNights} Nights)</td>
                                <td>${bookingData.roomCharges}</td>
                            </tr>
                            <tr>
                                <td>Service Fee</td>
                                <td>${bookingData.serviceFee}</td>
                            </tr>
                            <tr>
                                <td>Tax (2%)</td>
                                <td>${bookingData.tax}</td>
                            </tr>
                            <tr>
                                <td>Total Paid</td>
                                <td>${bookingData.totalAmount}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div class="footer-section">
                        <p>Thank you for booking with HostelBook! We wish you a pleasant stay.</p>
                    </div>
                </div>
                
                <div class="action-buttons no-print">
                    <button onclick="window.print()" style="padding: 10px 20px; margin: 10px; background: #4a6cf7; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Receipt</button>
                    <button onclick="window.close()" style="padding: 10px 20px; margin: 10px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer;">Go to Homepage</button>
                </div>
                
                <script>
                    setTimeout(() => {
                        window.print();
                    }, 500);
                </script>
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
                            <p>Thank you for choosing HostelBook! Your stay has been successfully booked and your payment has been received.</p>
                        </div>

                        <div className="divider"></div>

                        {/* Receipt Preview */}
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
                                    <div className="info-item">
                                        <span className="info-label">Name</span>
                                        <span className="info-value">{bookingData.guestName}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Phone</span>
                                        <span className="info-value">{bookingData.phone}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email</span>
                                        <span className="info-value">{bookingData.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Address</span>
                                        <span className="info-value">{bookingData.address}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="divider"></div>
                            
                            <div className="receipt-section">
                                <h3>Booking Information</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Booking ID</span>
                                        <span className="info-value">{bookingData.id}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Location</span>
                                        <span className="info-value">{bookingData.location}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Property</span>
                                        <span className="info-value">{bookingData.property}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Check-In</span>
                                        <span className="info-value">{bookingData.checkIn}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Nights</span>
                                        <span className="info-value">{bookingData.totalNights}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Check-out</span>
                                        <span className="info-value">{bookingData.checkOut}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Guests</span>
                                        <span className="info-value">{bookingData.guests}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="divider"></div>
                            
                            <div className="receipt-section">
                                <h3>Payment Details</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Payment Method</span>
                                        <span className="info-value">{bookingData.paymentMethod}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Transaction ID</span>
                                        <span className="info-value">{bookingData.transactionId}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Payment Date</span>
                                        <span className="info-value">{bookingData.paymentDate}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Status</span>
                                        <span className="info-value status-success">{bookingData.status}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="divider"></div>
                            
                            <div className="receipt-section">
                                <h3>Cost Breakdown</h3>
                                <div className="cost-breakdown">
                                    <div className="cost-item">
                                        <span>Room Charges ({bookingData.totalNights} Nights)</span>
                                        <span>{bookingData.roomCharges}</span>
                                    </div>
                                    <div className="cost-item">
                                        <span>Service Fee</span>
                                        <span>{bookingData.serviceFee}</span>
                                    </div>
                                    <div className="cost-item">
                                        <span>Tax (2%)</span>
                                        <span>{bookingData.tax}</span>
                                    </div>
                                    <div className="cost-item total">
                                        <span>Total Paid</span>
                                        <span>{bookingData.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="receipt-footer">
                                <p>Thank you for booking with HostelBook! We wish you a pleasant stay.</p>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button 
                                className="btn-download"
                                onClick={printReceipt}
                            >
                                Print Receipt
                            </button>
                            <button 
                                className="btn-home"
                                onClick={() => router.get('/')}
                            >
                                Go to Homepage
                            </button>
                            <button 
                                className="btn-dashboard"
                                onClick={() => router.get('/dashboard')}
                            >
                                View Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
                .booking-confirmed-page {
                    padding: 40px 0;
                    background-color: #f8f9fa;
                    min-height: calc(100vh - 160px);
                }
                
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 20px;
                }
                
                .confirmed-wrapper {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    padding: 40px;
                }
                
                .confirmed-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .confirmed-header h1 {
                    color: #2e7d32;
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 16px;
                }
                
                .confirmed-header p {
                    color: #666;
                    font-size: 16px;
                    line-height: 1.6;
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .divider {
                    height: 1px;
                    background: #e5e7eb;
                    margin: 25px 0;
                }
                
                .receipt-preview {
                    font-family: 'Inter', sans-serif;
                    color: #1a1a1a;
                }
                
                .receipt-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                .company-name {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                }
                
                .company-tagline {
                    font-size: 16px;
                    color: #6b7280;
                    font-weight: 400;
                    margin-bottom: 20px;
                }
                
                .receipt-meta {
                    display: flex;
                    justify-content: space-between;
                    font-size: 14px;
                    color: #4b5563;
                }
                
                .receipt-section h3 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 20px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px 40px;
                }
                
                .info-item {
                    display: flex;
                    flex-direction: column;
                }
                
                .info-label {
                    font-size: 14px;
                    color: #6b7280;
                    font-weight: 500;
                    margin-bottom: 4px;
                }
                
                .info-value {
                    font-size: 15px;
                    color: #1a1a1a;
                    font-weight: 500;
                }
                
                .status-success {
                    color: #2e7d32;
                    font-weight: 600;
                }
                
                .cost-breakdown {
                    width: 100%;
                }
                
                .cost-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #f3f4f6;
                }
                
                .cost-item.total {
                    border-bottom: 2px solid #1a1a1a;
                    font-weight: 700;
                    font-size: 16px;
                }
                
                .receipt-footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 2px solid #e5e7eb;
                    color: #6b7280;
                    font-size: 14px;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    margin-top: 40px;
                    flex-wrap: wrap;
                }
                
                .btn-download,
                .btn-home,
                .btn-dashboard {
                    padding: 12px 24px;
                    border: 2px solid #4a6cf7;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .btn-download {
                    background: #4a6cf7;
                    color: white;
                }
                
                .btn-download:hover {
                    background: #3a5bd9;
                    border-color: #3a5bd9;
                }
                
                .btn-home {
                    background: white;
                    color: #4a6cf7;
                }
                
                .btn-home:hover {
                    background: #4a6cf7;
                    color: white;
                }
                
                .btn-dashboard {
                    background: white;
                    color: #4a6cf7;
                }
                
                .btn-dashboard:hover {
                    background: #4a6cf7;
                    color: white;
                }
                
                @media (max-width: 768px) {
                    .confirmed-wrapper {
                        padding: 24px;
                    }
                    
                    .info-grid {
                        grid-template-columns: 1fr;
                        gap: 12px;
                    }
                    
                    .receipt-meta {
                        flex-direction: column;
                        gap: 8px;
                        text-align: center;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                        align-items: center;
                    }
                    
                    .btn-download,
                    .btn-home,
                    .btn-dashboard {
                        width: 100%;
                        max-width: 250px;
                    }
                }
            `}</style>
        </>
    );
}