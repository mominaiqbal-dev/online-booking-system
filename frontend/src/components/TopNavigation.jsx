import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopNavigation = ({ toggleMenu }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  // Fetch the logged-in user name from localStorage or API
  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    if (adminData && adminData.name) {
      setUserName(adminData.name); // set user's name
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("admin"); // remove admin data
    navigate("/"); // redirect to login page
  };

  return (
    <header className="bg-surface shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={toggleMenu}
            className="md:hidden mr-4 text-text-secondary"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Display Logged-in User Name */}
          {userName && (
            <div className="text-text-primary font-medium">
              Hello, <span className="font-semibold">{userName}</span>
            </div>
          )}

          {/* Profile and Logout */}
          <div className="relative flex items-center space-x-2">
            {/* Profile Button */}
            <button className="flex items-center text-sm focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-semibold">
                {userName ? userName.charAt(0).toUpperCase() : "A"}
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center text-sm focus:outline-none"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                <i className="fas fa-sign-out-alt"></i>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
