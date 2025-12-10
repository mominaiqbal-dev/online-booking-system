import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopNavigation from "../components/TopNavigation";
import MobileMenu from "../components/MobileMenu";

const API_ROOMS = "http://127.0.0.1:8000/api/rooms";
const API_HOSTELS = "http://127.0.0.1:8000/api/hostels";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [message, setMessage] = useState("");

  const [newRoom, setNewRoom] = useState({
    hostel_id: "",
    room_type: "",
    room_no: "",
    status: "Available",
    price: "",
  });

  useEffect(() => {
    fetchRooms();
    fetchHostels();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(API_ROOMS);
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchHostels = async () => {
    try {
      const res = await axios.get(API_HOSTELS);
      setHostels(res.data);
    } catch (error) {
      console.error("Error fetching hostels:", error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleModal = () => {
    setIsEditing(false);
    setMessage("");
    setNewRoom({
      hostel_id: "",
      room_type: "",
      room_no: "",
      status: "Available",
      price: "",
    });
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      let response;
      if (isEditing) {
        response = await axios.put(`${API_ROOMS}/${currentId}`, newRoom);
      } else {
        response = await axios.post(API_ROOMS, newRoom);
      }

      fetchRooms();
      setIsModalOpen(false);
      setIsEditing(false);
      setMessage(response.data.message || "✅ Room saved successfully!");
    } catch (error) {
      console.error("Error saving room:", error.response?.data || error.message);
      setMessage("❌ Failed to save room. Check console for details.");
    }
  };

  const handleEdit = (room) => {
    setIsEditing(true);
    setCurrentId(room.id);
    setNewRoom({
      hostel_id: room.hostel_id,
      room_type: room.room_type,
      room_no: room.room_no,
      status: room.status,
      price: room.price,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`${API_ROOMS}/${id}`);
        fetchRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";
      case "Occupied":
        return "bg-blue-100 text-blue-700";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation toggleMenu={toggleMenu} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Room Management</h2>
            <button
              onClick={toggleModal}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
            >
              <i className="fas fa-plus mr-2"></i> Add Room
            </button>
          </div>

          {message && (
            <div className="mb-4 p-3 text-center text-sm bg-green-100 text-green-700 rounded-md">
              {message}
            </div>
          )}

          {/* Rooms Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Hostel", "Room Type", "Room No", "Status", "Price", "Actions"].map((h, i) => (
                      <th
                        key={i}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        {room.hostel ? room.hostel.name : "N/A"}
                      </td>
                      <td className="px-6 py-4">{room.room_type}</td>
                      <td className="px-6 py-4">{room.room_no}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                            room.status
                          )}`}
                        >
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">Rs {room.price}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(room)}
                          className="text-blue-600 hover:underline mr-3"
                        >
                          <i className="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
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

          {/* Add/Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <button
                  onClick={toggleModal}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                  <i className="fas fa-times text-lg"></i>
                </button>

                <h3 className="text-lg font-semibold mb-4">
                  {isEditing ? "Edit Room" : "Add New Room"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Hostel Select */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Hostel</label>
                    <select
                      name="hostel_id"
                      value={newRoom.hostel_id}
                      onChange={handleChange}
                      required
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Hostel</option>
                      {hostels.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    name="room_type"
                    value={newRoom.room_type}
                    onChange={handleChange}
                    placeholder="Room Type"
                    required
                    className="w-full border p-2 rounded"
                  />

                  <input
                    name="room_no"
                    value={newRoom.room_no}
                    onChange={handleChange}
                    placeholder="Room Number"
                    required
                    className="w-full border p-2 rounded"
                  />

                  <select
                    name="status"
                    value={newRoom.status}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>

                  <input
                    type="number"
                    name="price"
                    value={newRoom.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                    className="w-full border p-2 rounded"
                  />

                  <div className="flex justify-end space-x-3">
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

export default RoomManagement;
