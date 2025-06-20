import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      toast.error("Failed to load bookings.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const fullName = b.fullName?.toLowerCase() || "";
    const email = b.email?.toLowerCase() || "";
    const phone = b.phone?.toLowerCase() || "";
    const date = new Date(b.bookedAt).toISOString().split("T")[0];
    const dep = b.departureFlight;
    const ret = b.returnFlight;
    const route = ret ? `${dep?.from} → ${dep?.to} → ${ret?.to}` : `${dep?.from} → ${dep?.to}`;
    return (
      fullName.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      phone.includes(search.toLowerCase()) ||
      route.toLowerCase().includes(search.toLowerCase()) ||
      date.includes(search)
    );
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCancel = (id) => {
    const updated = bookings.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b));
    setBookings(updated);
    toast.success("Booking cancelled");
    // axios.put(`/bookings/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
  };

  const handleRefund = (id) => {
    toast.success(`Refund initiated for booking #${id}`);
    // Optional backend call
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-violet-700">Manage Bookings</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name, email, phone, route, or date..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 w-full sm:w-1/2 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-violet-500"
        />

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Booker Info</th>
                <th className="p-4"># Passengers</th>
                <th className="p-4">Route</th>
                <th className="p-4">Date</th>
                <th className="p-4">Fare</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((b) => {
                  const dep = b.departureFlight;
                  const ret = b.returnFlight;
                  const route = ret ? `${dep?.from} → ${dep?.to} → ${ret?.to}` : `${dep?.from} → ${dep?.to}`;
                  const date = new Date(b.bookedAt).toISOString().split("T")[0];

                  return (
                    <tr key={b._id} className="border-t text-center hover:bg-gray-50">
                      <td className="p-4 font-mono text-xs text-gray-600">{b._id}</td>
                      <td className="p-4 text-left">
                        <p className="font-semibold">{b.fullName}</p>
                        <p className="text-xs text-gray-500">{b.email}</p>
                        <p className="text-xs text-gray-500">{b.phone}</p>
                      </td>
                      <td className="p-4">{b.passengers?.length || 0}</td>
                      <td className="p-4">{route}</td>
                      <td className="p-4">{date}</td>
                      <td className="p-4 font-semibold text-gray-800">₱{b.totalPrice.toLocaleString()}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            b.status === "paid"
                              ? "bg-green-100 text-green-700"
                              : b.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 space-x-2">
                        <button
                          onClick={() => handleCancel(b._id)}
                          disabled={b.status === "cancelled"}
                          className={`px-3 py-1 rounded text-white text-xs font-medium ${
                            b.status === "cancelled" ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRefund(b._id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium px-3 py-1 rounded"
                        >
                          Refund
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 pt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-violet-500 text-white" : ""}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
