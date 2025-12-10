import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNavigation from "../components/TopNavigation";
import MobileMenu from "../components/MobileMenu";

const GuestsManagement = () => {
  const [guests, setGuests] = useState([
    { 
      id: 1, 
      guest_id: "GST001",
      name: "John Smith", 
      email: "john.smith@email.com", 
      phone: "+977-9841234567",
      room_assigned: "101",
      check_in_date: "2024-01-20",
      check_out_date: "2024-01-25",
      status: "Checked In"
    },
    { 
      id: 2, 
      guest_id: "GST002",
      name: "Maria Johnson", 
      email: "maria.j@email.com", 
      phone: "+977-9851234567",
      room_assigned: "102",
      check_in_date: "2024-01-22",
      check_out_date: "2024-01-24",
      status: "Reserved"
    },
    { 
      id: 3, 
      guest_id: "GST003",
      name: "Robert Williams", 
      email: "robert.w@email.com", 
      phone: "+977-9861234567",
      room_assigned: "201",
      check_in_date: "2024-01-18",
      check_out_date: "2024-01-21",
      status: "Checked Out"
    },
    { 
      id: 4, 
      guest_id: "GST004",
      name: "Sarah Davis", 
      email: "sarah.d@email.com", 
      phone: "+977-9871234567",
      room_assigned: "104",
      check_in_date: "2024-01-23",
      check_out_date: "2024-01-26",
      status: "Checked In"
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    phone: "",
    room_assigned: "",
    check_in_date: "",
    check_out_date: "",
    status: "Reserved",
  });

  // Menu toggle for mobile
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Modal toggle
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGuest((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddGuest = (e) => {
    e.preventDefault();
    const newGuestWithId = { 
      id: guests.length + 1, 
      guest_id: `GST${String(guests.length + 1).padStart(3, '0')}`,
      ...newGuest
    };
    setGuests((prev) => [...prev, newGuestWithId]);
    setNewGuest({ 
      name: "", 
      email: "", 
      phone: "", 
      room_assigned: "", 
      check_in_date: "", 
      check_out_date: "", 
      status: "Reserved" 
    });
    setIsModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Checked In":
        return "bg-green-100 text-success";
      case "Reserved":
        return "bg-blue-100 text-primary";
      case "Checked Out":
        return "bg-gray-100 text-text-secondary";
      case "Cancelled":
        return "bg-red-100 text-error";
      default:
        return "bg-gray-100 text-text-secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate statistics
  const totalGuests = guests.length;
  const checkedInGuests = guests.filter(guest => guest.status === "Checked In").length;
  const reservedGuests = guests.filter(guest => guest.status === "Reserved").length;
  const checkedOutGuests = guests.filter(guest => guest.status === "Checked Out").length;

  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation toggleMenu={toggleMenu} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Guests Management</h2>
            <button
              onClick={toggleModal}
              className="bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center transition-all duration-200 btn-primary"
            >
              <i className="fas fa-user-plus mr-2"></i> Add Guest
            </button>
          </div>

          {/* Guests Table */}
          <div className="bg-surface rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Guest ID", "Name", "Email", "Phone", "Room", "Check-in", "Check-out", "Status", "Actions"].map((h, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {guests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                        {guest.guest_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                            {guest.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-text-primary">
                              {guest.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {guest.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {guest.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        Room {guest.room_assigned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {formatDate(guest.check_in_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {formatDate(guest.check_out_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(guest.status)}`}
                        >
                          {guest.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary hover:text-blue-700 transition-colors duration-200 text-sm mr-3">
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </button>
                        <button className="text-error hover:text-red-700 transition-colors duration-200 text-sm">
                          <i className="fas fa-trash mr-1"></i>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


          {/* Add Guest Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 modal-overlay">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative modal-content">
                <button
                  onClick={toggleModal}
                  className="absolute top-3 right-3 text-gray-500 hover:text-error transition-colors duration-200"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>

                <h3 className="text-lg font-semibold mb-4">Add New Guest</h3>

                <form onSubmit={handleAddGuest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-text-secondary">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newGuest.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter guest's full name"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-text-secondary">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newGuest.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter email address"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-text-secondary">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={newGuest.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter phone number"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-text-secondary">
                      Room Assigned
                    </label>
                    <select
                      name="room_assigned"
                      value={newGuest.room_assigned}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                    >
                      <option value="">Select Room</option>
                      <option value="101">Room 101</option>
                      <option value="102">Room 102</option>
                      <option value="103">Room 103</option>
                      <option value="104">Room 104</option>
                      <option value="201">Room 201</option>
                      <option value="202">Room 202</option>
                      <option value="203">Room 203</option>
                      <option value="204">Room 204</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-text-secondary">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      name="check_in_date"
                      value={newGuest.check_in_date}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-text-secondary">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      name="check_out_date"
                      value={newGuest.check_out_date}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-text-secondary">
                      Status
                    </label>
                    <select
                      name="status"
                      value={newGuest.status}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-primary focus:border-primary transition-colors duration-200"
                    >
                      <option value="Reserved">Reserved</option>
                      <option value="Checked In">Checked In</option>
                      <option value="Checked Out">Checked Out</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={toggleModal}
                      className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 btn-primary"
                    >
                      <i className="fas fa-save mr-2"></i>
                      Save Guest
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </div>
  );
};

export default GuestsManagement;