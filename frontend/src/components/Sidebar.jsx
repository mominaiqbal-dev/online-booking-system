import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: "fa-tachometer-alt", label: "Dashboard", path: "/dashboard" },
    { icon: "fa-tachometer-alt", label: "Hostel Management", path: "/HostelManagement" },
    { icon: "fa-bed", label: "Room Management", path: "/rooms" },
    { icon: "fa-calendar-check", label: "Bookings", path: "/bookings" },
    { icon: "fa-users", label: "Payments Management", path: "/PaymentsManagement" },
    
  ];

  return (
    <div className="hidden md:flex flex-col w-64 bg-surface shadow-md z-10">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
            <i className="fas fa-building"></i>
          </div>
          <h1 className="ml-3 text-xl font-semibold">Hostel Booking System</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive ? "active text-primary" : ""
                }`}
              >
                <i
                  className={`fas ${item.icon} w-5 mr-3 ${
                    isActive ? "text-primary" : "text-text-secondary"
                  }`}
                ></i>
                {item.label}
              </Link>
            );
          })}
        </nav>

        
      </div>

    </div>
  );
};

export default Sidebar;
