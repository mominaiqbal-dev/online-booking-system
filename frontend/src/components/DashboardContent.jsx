import React from "react";

const DashboardContent = () => {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Rooms",
            value: "142",
            icon: "fa-bed",
            color: "primary",
            bg: "bg-blue-100",
            border: "border-primary",
            change: "12% increase",
            textColor: "text-success",
            arrow: "fa-arrow-up",
          },
          {
            title: "Current Guests",
            value: "86",
            icon: "fa-users",
            color: "secondary",
            bg: "bg-purple-100",
            border: "border-secondary",
            change: "5% increase",
            textColor: "text-success",
            arrow: "fa-arrow-up",
          },
          {
            title: "Today's Check-ins",
            value: "14",
            icon: "fa-calendar-check",
            color: "accent",
            bg: "bg-cyan-100",
            border: "border-accent",
            change: "2% decrease",
            textColor: "text-warning",
            arrow: "fa-minus",
          },
          {
            title: "Revenue",
            value: "$12,458",
            icon: "fa-dollar-sign",
            color: "success",
            bg: "bg-green-100",
            border: "border-success",
            change: "18% increase",
            textColor: "text-success",
            arrow: "fa-arrow-up",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`stat-card bg-surface rounded-xl shadow-sm p-6 border-l-4 ${card.border}`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <i className={`fas ${card.icon} text-${card.color} text-xl`}></i>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-text-secondary">{card.title}</h3>
                <p className="text-2xl font-semibold">{card.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className={`flex items-center text-sm ${card.textColor}`}>
                <i className={`fas ${card.arrow} mr-1`}></i>
                <span>{card.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Room Occupancy */}
        <div className="lg:col-span-2 bg-surface rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Room Occupancy</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-primary text-white rounded-lg">Week</button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-text-secondary rounded-lg">Month</button>
              <button className="px-3 py-1 text-xs bg-gray-100 text-text-secondary rounded-lg">Year</button>
            </div>
          </div>

          <div className="h-80 flex items-end justify-between pt-4">
            {[
              { day: "Mon", height: "160px" },
              { day: "Tue", height: "190px" },
              { day: "Wed", height: "220px" },
              { day: "Thu", height: "180px" },
              { day: "Fri", height: "250px" },
              { day: "Sat", height: "280px" },
              { day: "Sun", height: "200px" },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-10 bg-primary rounded-t-lg mb-2"
                  style={{ height: bar.height }}
                ></div>
                <span className="text-xs text-text-secondary">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Status */}
        <div className="bg-surface rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Room Status</h3>
          <div className="space-y-4">
            {[
              { label: "Available", percent: 64, color: "bg-success" },
              { label: "Occupied", percent: 28, color: "bg-primary" },
              { label: "Maintenance", percent: 8, color: "bg-warning" },
            ].map((status, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">{status.label}</span>
                  <span className="font-medium">{status.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${status.color} h-2 rounded-full progress-bar`}
                    style={{ width: `${status.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-medium mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="btn-primary text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center">
                <i className="fas fa-plus mr-2"></i>
                Add Room
              </button>
              <button className="bg-gray-100 text-text-primary py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center">
                <i className="fas fa-sync mr-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-surface rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Bookings</h3>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {["Guest", "Room", "Check-in", "Status"].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  {
                    initials: "JS",
                    name: "John Smith",
                    room: "Double Room #204",
                    time: "Today, 2:00 PM",
                    status: "Confirmed",
                    color: "bg-green-100 text-success",
                    gradient: "from-primary to-secondary",
                  },
                  {
                    initials: "MJ",
                    name: "Maria Johnson",
                    room: "Single Room #112",
                    time: "Tomorrow, 11:00 AM",
                    status: "Pending",
                    color: "bg-yellow-100 text-warning",
                    gradient: "from-accent to-secondary",
                  },
                  {
                    initials: "RW",
                    name: "Robert Williams",
                    room: "Suite #305",
                    time: "Today, 6:00 PM",
                    status: "Confirmed",
                    color: "bg-green-100 text-success",
                    gradient: "from-warning to-error",
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-8 w-8 bg-gradient-to-r ${row.gradient} rounded-full flex items-center justify-center text-white text-xs font-semibold`}
                        >
                          {row.initials}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{row.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {row.room}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {row.time}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.color}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: "fa-bed",
                color: "bg-blue-100 text-primary",
                text: "Room #204 checked out",
                time: "10 minutes ago",
              },
              {
                icon: "fa-user-check",
                color: "bg-green-100 text-success",
                text: "New booking confirmed",
                time: "1 hour ago",
              },
              {
                icon: "fa-tools",
                color: "bg-yellow-100 text-warning",
                text: "Maintenance request for Room #118",
                time: "2 hours ago",
              },
              {
                icon: "fa-star",
                color: "bg-purple-100 text-secondary",
                text: "New 5-star review received",
                time: "5 hours ago",
              },
            ].map((activity, i) => (
              <div key={i} className="flex">
                <div className="flex-shrink-0">
                  <div
                    className={`h-10 w-10 rounded-full ${activity.color.split(" ")[0]} flex items-center justify-center`}
                  >
                    <i className={`fas ${activity.icon} ${activity.color.split(" ")[1]}`}></i>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-sm text-text-secondary">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardContent;
