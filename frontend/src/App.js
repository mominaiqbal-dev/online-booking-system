import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import RoomManagement from "./pages/RoomManagement";
import HostelManagement from "./pages/HostelManagement";
import GuestsManagement from "./pages/GuestsManagement";
import PaymentsManagement from "./pages/PaymentsManagement";
import Bookings from "./pages/bookings";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<RoomManagement />} />
        <Route path="/Bookings" element={<Bookings />} />
        <Route path="/HostelManagement" element={<HostelManagement />} />
        <Route path="/GuestsManagement" element={<GuestsManagement />} />
        <Route path="/PaymentsManagement" element={<PaymentsManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
