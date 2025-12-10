import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopNavigation from "../components/TopNavigation";
import MobileMenu from "../components/MobileMenu";

const API_BASE = "http://127.0.0.1:8000/api/payments";

const PaymentsManagement = () => {
  const [payments, setPayments] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(API_BASE);
      setPayments(res.data.data || []);
    } catch (error) {
      console.error("Error fetching payments:", error.response?.data || error.message);
      setMessage("Failed to load payments.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation toggleMenu={toggleMenu} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold">Payments Management</h2>
          </div>

          {message && (
            <div className="mb-4 p-3 text-center bg-red-100 text-red-700 rounded-md">
              {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "ID",
                      "Booking ID",
                      "Payment Method",
                      "Card Holder Name",
                      "Card Number",
                      "Expiry Date",
                      "CVV",
                      "Mobile Number",
                      "OTP",
                      "Amount",
                      "Status",
                      "Terms Accepted",
                      "Created At",
                      "Updated At",
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="px-3 sm:px-6 py-3 text-left font-medium text-gray-700 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {payments.length > 0 ? (
                    payments.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition">
                        <td className="px-3 sm:px-6 py-4">{p.id}</td>
                        <td className="px-3 sm:px-6 py-4">{p.booking_id}</td>
                        <td className="px-3 sm:px-6 py-4 capitalize">{p.payment_method}</td>
                        <td className="px-3 sm:px-6 py-4">{p.card_holder_name || "-"}</td>
                        <td className="px-3 sm:px-6 py-4">{p.card_number || "-"}</td>
                        <td className="px-3 sm:px-6 py-4">{p.expiry_date || "-"}</td>
                        <td className="px-3 sm:px-6 py-4">{p.cvv || "-"}</td>
                        <td className="px-3 sm:px-6 py-4">{p.mobile_number || "-"}</td>
                        <td className="px-3 sm:px-6 py-4">{p.otp || "-"}</td>
                        <td className="px-3 sm:px-6 py-4">Rs {p.amount}</td>
                        <td className="px-3 sm:px-6 py-4">{p.status}</td>
                        <td className="px-3 sm:px-6 py-4">{p.terms_accepted ? "Yes" : "No"}</td>
                        <td className="px-3 sm:px-6 py-4">
                          {new Date(p.created_at).toLocaleString()}
                        </td>
                        <td className="px-3 sm:px-6 py-4">
                          {new Date(p.updated_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="14" className="px-3 py-4 text-center text-gray-600">
                        No payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <MobileMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </div>
  );
};

export default PaymentsManagement;
