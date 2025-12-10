import React from "react";

const MobileMenu = ({ isOpen, toggleMenu }) => {
  return (
    <div
      className={`mobile-menu fixed inset-0 z-40 md:hidden ${
        isOpen ? "open" : ""
      }`}
    >
      <div
        className="fixed inset-0 bg-gray-600 opacity-75"
        onClick={toggleMenu}
      ></div>

      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-surface">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            onClick={toggleMenu}
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <i className="fas fa-times text-white text-xl"></i>
          </button>
        </div>

        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
              <i className="fas fa-building"></i>
            </div>
            <h1 className="ml-3 text-xl font-semibold">HostelHub</h1>
          </div>

          <nav className="mt-5 px-2 space-y-1">
            {[
              { icon: "fa-tachometer-alt", label: "Dashboard", active: true },
              { icon: "fa-bed", label: "Room Management" },
              { icon: "fa-calendar-check", label: "Bookings" },
              { icon: "fa-users", label: "Guests" },
              { icon: "fa-chart-bar", label: "Analytics" },
              { icon: "fa-cog", label: "Settings" },
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                className={`sidebar-item flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.active ? "active" : ""
                }`}
              >
                <i
                  className={`fas ${item.icon} w-5 mr-3 ${
                    item.active ? "text-primary" : "text-text-secondary"
                  }`}
                ></i>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&w=256&h=256&q=80"
                alt="Admin profile"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs font-medium text-text-secondary">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
