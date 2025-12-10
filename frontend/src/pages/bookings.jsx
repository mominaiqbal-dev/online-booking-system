import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopNavigation from "../components/TopNavigation";
import MobileMenu from "../components/MobileMenu";

const API_BASE = "http://127.0.0.1:8000/api/admin/bookings";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [message, setMessage] = useState("");
  const [bookingData, setBookingData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    check_in_date: "",
    check_out_date: "",
    number_of_guests: "",
    room_type: "",
    special_requests: "",
    hostel_name: "",
    hostel_location: "",
    room_price: "",
    status: "pending",
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(API_BASE);
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error.response?.data || error.message);
      setMessage("Failed to load bookings.");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleModal = () => {
    setIsEditing(false);
    setMessage("");
    setBookingData({
      full_name: "",
      phone_number: "",
      email: "",
      check_in_date: "",
      check_out_date: "",
      number_of_guests: "",
      room_type: "",
      special_requests: "",
      hostel_name: "",
      hostel_location: "",
      room_price: "",
      status: "pending",
    });
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let response;
      if (isEditing) {
        response = await axios.patch(`${API_BASE}/${currentId}`, bookingData);
      } else {
        response = await axios.post(API_BASE, bookingData);
      }

      // refresh
      await fetchBookings();
      setIsModalOpen(false);
      setIsEditing(false);

      const msg = response.data.message || (response.data.booking ? "Saved successfully" : "Operation successful");
      setMessage(msg);
    } catch (error) {
      console.error("Error saving booking:", error.response?.data || error.message);
      const errMsg = error.response?.data?.message || (error.response?.data?.errors ? "Validation failed" : "Save failed");
      setMessage(`❌ ${errMsg}`);
    }
  };

  const handleEdit = (booking) => {
    setIsEditing(true);
    setCurrentId(booking.id);
    setBookingData({
      full_name: booking.full_name || "",
      phone_number: booking.phone_number || "",
      email: booking.email || "",
      check_in_date: booking.check_in_date || "",
      check_out_date: booking.check_out_date || "",
      number_of_guests: booking.number_of_guests || "",
      room_type: booking.room_type || "",
      special_requests: booking.special_requests || "",
      hostel_name: booking.hostel_name || "",
      hostel_location: booking.hostel_location || "",
      room_price: booking.room_price || "",
      status: booking.status || "pending",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      await fetchBookings();
      setMessage("Booking deleted successfully.");
    } catch (error) {
      console.error("Error deleting booking:", error.response?.data || error.message);
      setMessage("❌ Failed to delete booking.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation toggleMenu={toggleMenu} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-0">Booking Management</h2>
            <button
              onClick={toggleModal}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
            >
              <i className="fas fa-plus mr-2"></i> Add Booking
            </button>
          </div>

          {message && (
            <div className="mb-4 p-3 text-center text-sm sm:text-base bg-green-100 text-green-700 rounded-md">
              {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Full Name",
                      "Phone",
                      "Email",
                      "Check In",
                      "Check Out",
                      "Guests",
                      "Room Type",
                      "Hostel",
                      "Location",
                      "Price",
                      "Status",
                      "Actions",
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="px-3 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-600 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-6 py-2 sm:py-4">{b.full_name}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">{b.phone_number}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">{b.email}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">{b.check_in_date}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">{b.check_out_date}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">{b.number_of_guests}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">{b.room_type}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">{b.hostel_name}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">{b.hostel_location}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">{b.room_price}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4">
                        <span
                          className={`px-2 py-1 text-xs sm:text-sm rounded-full font-medium ${getStatusColor(
                            b.status
                          )}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 flex flex-col sm:flex-row gap-1 sm:gap-3">
                        <button
                          onClick={() => handleEdit(b)}
                          className="text-blue-600 hover:underline"
                        >
                          <i className="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="text-red-600 hover:underline"
                        >
                          <i className="fas fa-trash mr-1"></i>Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl p-4 sm:p-6 relative">
                <button
                  onClick={toggleModal}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>

                <h3 className="text-lg sm:text-xl font-semibold mb-4">
                  {isEditing ? "Edit Booking" : "Add New Booking"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      name="full_name"
                      value={bookingData.full_name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="phone_number"
                      value={bookingData.phone_number}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      required
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="email"
                      value={bookingData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      type="email"
                      required
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="check_in_date"
                      value={bookingData.check_in_date}
                      onChange={handleChange}
                      placeholder="Check-in Date"
                      type="date"
                      required
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="check_out_date"
                      value={bookingData.check_out_date}
                      onChange={handleChange}
                      placeholder="Check-out Date"
                      type="date"
                      required
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="number_of_guests"
                      value={bookingData.number_of_guests}
                      onChange={handleChange}
                      placeholder="Number of Guests"
                      type="number"
                      required
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="room_type"
                      value={bookingData.room_type}
                      onChange={handleChange}
                      placeholder="Room Type"
                      required
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="special_requests"
                      value={bookingData.special_requests}
                      onChange={handleChange}
                      placeholder="Special Requests"
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="hostel_name"
                      value={bookingData.hostel_name}
                      onChange={handleChange}
                      placeholder="Hostel Name"
                      required
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="hostel_location"
                      value={bookingData.hostel_location}
                      onChange={handleChange}
                      placeholder="Hostel Location"
                      required
                      className="w-full border p-2 rounded"
                    />
                    <input
                      name="room_price"
                      value={bookingData.room_price}
                      onChange={handleChange}
                      placeholder="Room Price"
                      type="number"
                      required
                      className="w-full border p-2 rounded"
                    />
                    <select
                      name="status"
                      value={bookingData.status}
                      onChange={handleChange}
                      className="w-full border p-2 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 mt-2">
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="bg-gray-300 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      {isEditing ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
      <MobileMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </div>
  );
};

export default BookingManagement;
