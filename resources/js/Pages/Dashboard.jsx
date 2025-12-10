import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

export default function Dashboard() {
    const { auth, stats, bookings } = usePage().props;
    const [activeFilter, setActiveFilter] = useState('all');
    const [editingBooking, setEditingBooking] = useState(null);
    const [editForm, setEditForm] = useState({
        full_name: '',
        phone_number: '',
        email: '',
        check_in_date: '',
        check_out_date: '',
        number_of_guests: 1,
        room_type: '',
        special_requests: ''
    });

    const handleCreateBooking = () => {
        router.visit("/booking-form");
    };

    const handleProfile = () => {
        router.visit("/profile");
    };

    const handleBoxClick = (filter) => {
        setActiveFilter(filter);
    };

    const handlePayment = (bookingId) => {
        router.visit(`/payment?booking_id=${bookingId}`);
    };

    const handleViewDetails = (bookingId) => {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            alert(`Booking Details:\n\nName: ${booking.full_name}\nEmail: ${booking.email}\nPhone: ${booking.phone_number}\nCheck-in: ${formatDate(booking.check_in_date)}\nCheck-out: ${formatDate(booking.check_out_date)}\nGuests: ${booking.number_of_guests}\nRoom: ${booking.room_type}\nHotel: ${booking.hostel_name}\nAmount: Rs. ${booking.room_price}\nStatus: ${booking.payment_status === 'completed' ? 'Confirmed' : 'Pending Payment'}`);
        }
    };

    // Edit Booking Functions
    const handleEditBooking = (booking) => {
        setEditingBooking(booking.id);
        setEditForm({
            full_name: booking.full_name,
            phone_number: booking.phone_number,
            email: booking.email,
            check_in_date: booking.check_in_date.split('T')[0], // Format for date input
            check_out_date: booking.check_out_date.split('T')[0],
            number_of_guests: booking.number_of_guests,
            room_type: booking.room_type,
            special_requests: booking.special_requests || ''
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`/api/bookings/${editingBooking}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify(editForm)
            });

            if (response.ok) {
                const updatedBooking = await response.json();
                alert('Booking updated successfully!');
                router.reload(); // Refresh the page to show updated data
            } else {
                const errorData = await response.json();
                alert('Failed to update booking: ' + (errorData.error || errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Error updating booking. Please try again.');
        } finally {
            setEditingBooking(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingBooking(null);
    };

    // Delete Booking Function
    const handleDeleteBooking = async (bookingId) => {
        if (confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
            try {
                const response = await fetch(`/api/bookings/${bookingId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    alert('Booking cancelled successfully!');
                    router.reload(); // Refresh the page to show updated data
                } else {
                    const errorData = await response.json();
                    alert('Failed to cancel booking: ' + (errorData.error || errorData.message || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error cancelling booking:', error);
                alert('Error cancelling booking. Please try again.');
            }
        }
    };

    // Filter bookings based on active filter
    const filteredBookings = bookings.filter(booking => {
        switch (activeFilter) {
            case 'pending':
                return !booking.has_payment || booking.payment_status !== 'completed';
            case 'confirmed':
                return booking.has_payment && booking.payment_status === 'completed';
            case 'completed':
                return booking.has_payment && booking.payment_status === 'completed';
            default:
                return true;
        }
    });

    const getStatusBadge = (booking) => {
        if (booking.has_payment && booking.payment_status === 'completed') {
            return (
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Confirmed ✅
                </span>
            );
        } else {
            return (
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                    Pending Payment ⏳
                </span>
            );
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const formatCurrency = (amount) => {
        return `Rs. ${(amount || 0).toLocaleString()}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" style={{ paddingTop: "80px" }}>
            <Header />

            <div className="pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Welcome Section */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center mb-4 lg:mb-0">
                                <div className="bg-white p-3 rounded-xl shadow-sm mr-4 border border-gray-200">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Welcome back, {auth?.user?.name || "User"}! 
                                    </h1>
                                    <p className="text-gray-600 mt-1">Here's your booking dashboard overview</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCreateBooking}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create Booking
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards - Clickable */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Bookings Card */}
                        <div 
                            onClick={() => handleBoxClick('all')}
                            className={`bg-white rounded-2xl shadow-lg border-2 p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                                activeFilter === 'all' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Bookings</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                                    <p className="text-xs text-gray-500 mt-1">All time bookings</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Pending Payments Card */}
                        <div 
                            onClick={() => handleBoxClick('pending')}
                            className={`bg-white rounded-2xl shadow-lg border-2 p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                                activeFilter === 'pending' ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-orange-300'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Pending Payments</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.pendingPayments}</p>
                                    <p className="text-xs text-gray-500 mt-1">Awaiting payment</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Confirmed Bookings Card */}
                        <div 
                            onClick={() => handleBoxClick('confirmed')}
                            className={`bg-white rounded-2xl shadow-lg border-2 p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                                activeFilter === 'confirmed' ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Confirmed Bookings</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.confirmedBookings}</p>
                                    <p className="text-xs text-gray-500 mt-1">Fully paid</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Completed Payments Card */}
                        <div 
                            onClick={() => handleBoxClick('completed')}
                            className={`bg-white rounded-2xl shadow-lg border-2 p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                                activeFilter === 'completed' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Completed Payments</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.completedPayments}</p>
                                    <p className="text-xs text-gray-500 mt-1">Successful payments</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filter Indicator */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                        <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {activeFilter === 'all' && 'All Bookings'}
                                    {activeFilter === 'pending' && 'Pending Payments'}
                                    {activeFilter === 'confirmed' && 'Confirmed Bookings'}
                                    {activeFilter === 'completed' && 'Completed Payments'}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    Showing {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                {['all', 'pending', 'confirmed', 'completed'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => handleBoxClick(filter)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            activeFilter === filter
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        {filteredBookings.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Booking Details
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Dates & Guests
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredBookings.map((booking) => (
                                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {booking.hostel_name || "Hotel Booking"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {booking.room_type || "Room"} • {booking.full_name}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            Created: {booking.created_at}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        <div className="font-medium">{formatDate(booking.check_in_date)}</div>
                                                        <div className="text-gray-500">to {formatDate(booking.check_out_date)}</div>
                                                        <div className="text-gray-600 mt-1">
                                                            {booking.number_of_guests} {booking.number_of_guests > 1 ? "Guests" : "Guest"}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {formatCurrency(booking.room_price)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(booking)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {(!booking.has_payment || booking.payment_status !== 'completed') && (
                                                            <button
                                                                onClick={() => handlePayment(booking.id)}
                                                                className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                                            >
                                                                Pay Now
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleViewDetails(booking.id)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditBooking(booking)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBooking(booking.id)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="max-w-sm mx-auto">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                                    <p className="text-gray-500 mb-6">
                                        {activeFilter === 'all' && "You haven't made any bookings yet."}
                                        {activeFilter === 'pending' && "No pending payments found."}
                                        {activeFilter === 'confirmed' && "No confirmed bookings found."}
                                        {activeFilter === 'completed' && "No completed payments found."}
                                    </p>
                                    <button
                                        onClick={handleCreateBooking}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                                    >
                                        Create Your First Booking
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Booking Modal */}
            {editingBooking && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Booking</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={editForm.full_name}
                                        onChange={handleEditFormChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        type="text"
                                        name="phone_number"
                                        value={editForm.phone_number}
                                        onChange={handleEditFormChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditFormChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Room Type</label>
                                    <select
                                        name="room_type"
                                        value={editForm.room_type}
                                        onChange={handleEditFormChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Single Room">Single Room</option>
                                        <option value="Double Room">Double Room</option>
                                        <option value="Sharing Room">Sharing Room</option>
                                        <option value="Deluxe Room">Deluxe Room</option>
                                        <option value="Suite">Suite</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                                    <input
                                        type="date"
                                        name="check_in_date"
                                        value={editForm.check_in_date}
                                        onChange={handleEditFormChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                                    <input
                                        type="date"
                                        name="check_out_date"
                                        value={editForm.check_out_date}
                                        onChange={handleEditFormChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
                                    <input
                                        type="number"
                                        name="number_of_guests"
                                        value={editForm.number_of_guests}
                                        onChange={handleEditFormChange}
                                        min="1"
                                        max="10"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Special Requests</label>
                                    <textarea
                                        name="special_requests"
                                        value={editForm.special_requests}
                                        onChange={handleEditFormChange}
                                        rows="3"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}