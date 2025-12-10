import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopNavigation from "../components/TopNavigation";
import MobileMenu from "../components/MobileMenu";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/dashboard-stats";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [stats, setStats] = useState({
    total_bookings: 0,
    total_payments: 0,
    total_hostels: 0,
    total_rooms: 0,
    pending_payments: 0,
    completed_payments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(API_BASE);
      setStats(res.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="flex h-screen bg-background text-text-primary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation toggleMenu={toggleMenu} />

        {/* Dashboard Content */}
        <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Card Component */}
          <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Total Bookings</h3>
            <p className="text-3xl font-bold mt-2">{stats.total_bookings}</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Total Payments</h3>
            <p className="text-3xl font-bold mt-2">{stats.total_payments}</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Total Hostels</h3>
            <p className="text-3xl font-bold mt-2">{stats.total_hostels}</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Total Rooms</h3>
            <p className="text-3xl font-bold mt-2">{stats.total_rooms}</p>
          </div>

          {/* Pending Payments */}
          <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Pending Payments</h3>
            <p className="text-3xl font-bold mt-2 text-yellow-600">
              {stats.pending_payments}
            </p>
          </div>

          {/* Completed Payments */}
          <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold">Completed Payments</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {stats.completed_payments}
            </p>
          </div>

        </main>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </div>
  );
};

export default Dashboard;
