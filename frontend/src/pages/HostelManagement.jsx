import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopNavigation from "../components/TopNavigation";
import MobileMenu from "../components/MobileMenu";

const API_BASE = "http://127.0.0.1:8000/api/hostels";

const HostelManagement = () => {
  const [hostels, setHostels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [message, setMessage] = useState("");
  const [newHostel, setNewHostel] = useState({
    name: "",
    description: "",
    location: "",
    contact: "",
    image: null,
    capacity: "",
    rating: "",
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const res = await axios.get(API_BASE);
      setHostels(res.data);
    } catch (error) {
      console.error("Error fetching hostels:", error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleModal = () => {
    setIsEditing(false);
    setMessage("");
    setNewHostel({
      name: "",
      description: "",
      location: "",
      contact: "",
      image: null,
      capacity: "",
      rating: "",
    });
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewHostel((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewHostel((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(newHostel).forEach(([key, value]) => {
        if (value !== null && value !== "") formData.append(key, value);
      });

      let response;
      if (isEditing) {
        response = await axios.post(`${API_BASE}/${currentId}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axios.post(API_BASE, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchHostels();
      setIsModalOpen(false);
      setIsEditing(false);
      setMessage(response.data.message || "Hostel saved successfully!");
    } catch (error) {
      console.error("Error saving hostel:", error.response?.data || error.message);
      setMessage("❌ Failed to save hostel. Check console for details.");
    }
  };

  const handleEdit = (hostel) => {
    setIsEditing(true);
    setCurrentId(hostel.id);
    setNewHostel({
      name: hostel.name,
      description: hostel.description,
      location: hostel.location,
      contact: hostel.contact,
      image: null,
      capacity: hostel.capacity,
      rating: hostel.rating,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      try {
        await axios.delete(`${API_BASE}/${id}`);
        fetchHostels();
      } catch (error) {
        console.error("Error deleting hostel:", error);
      }
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "bg-green-100 text-green-700";
    if (rating >= 4.0) return "bg-blue-100 text-blue-700";
    if (rating >= 3.5) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-400"></i>);
    }

    return stars;
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation toggleMenu={toggleMenu} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Hostel Management</h2>
            <button
              onClick={toggleModal}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
            >
              <i className="fas fa-plus mr-2"></i> Add Hostel
            </button>
          </div>

          {message && (
            <div className="mb-4 p-3 text-center text-sm bg-green-100 text-green-700 rounded-md">
              {message}
            </div>
          )}

          {/* Hostels Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Description", "Location", "Contact", "Image", "Capacity", "Rating", "Actions"].map(
                      (h, i) => (
                        <th
                          key={i}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {hostels.map((hostel) => (
                    <tr key={hostel.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">{hostel.name}</td>
                      <td className="px-6 py-4">{hostel.description}</td>
                      <td className="px-6 py-4">{hostel.location}</td>
                      <td className="px-6 py-4">{hostel.contact}</td>
                      <td className="px-6 py-4">
                        {hostel.image ? (
                          <img
                            src={`http://127.0.0.1:8000/storage/${hostel.image}`}
                            alt="Hostel"
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <span className="text-gray-400 italic">No image</span>
                        )}
                      </td>
                      <td className="px-6 py-4">{hostel.capacity}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex mr-2">{renderStars(hostel.rating)}</div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${getRatingColor(
                              hostel.rating
                            )}`}
                          >
                            {hostel.rating}/5
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(hostel)}
                          className="text-blue-600 hover:underline mr-3"
                        >
                          <i className="fas fa-edit mr-1"></i>Edit
                        </button>
                        <button
                          onClick={() => handleDelete(hostel.id)}
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
                  {isEditing ? "Edit Hostel" : "Add New Hostel"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    name="name"
                    value={newHostel.name}
                    onChange={handleChange}
                    placeholder="Hostel Name"
                    required
                    className="w-full border p-2 rounded"
                  />
                  <input
                    name="description"
                    value={newHostel.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    name="location"
                    value={newHostel.location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                    className="w-full border p-2 rounded"
                  />
                  <input
                    name="contact"
                    value={newHostel.contact}
                    onChange={handleChange}
                    placeholder="Contact"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border p-2 rounded"
                  />
                  <input
                    name="capacity"
                    value={newHostel.capacity}
                    onChange={handleChange}
                    placeholder="Capacity"
                    required
                    className="w-full border p-2 rounded"
                  />
                  <input
                    name="rating"
                    value={newHostel.rating}
                    onChange={handleChange}
                    placeholder="Rating (0–5)"
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

export default HostelManagement;
