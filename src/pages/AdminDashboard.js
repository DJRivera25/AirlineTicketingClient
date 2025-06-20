import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const AdminDashboard = () => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [users, setUsers] = useState("");
  const [passengers, setPassengers] = useState("");
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      try {
        const [bookingsRes, usersRes, flightsRes, passengersRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASEURL}/bookings/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_BASEURL}/users/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_BASEURL}/flights/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API_BASEURL}/passengers/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setRecentBookings(bookingsRes.data.slice(0, 10));
        setUsers(usersRes.data.totalUsers);
        setFlights(flightsRes.data.totalItems);
        setPassengers(passengersRes.data.length);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      }
    };

    fetchData();
  }, []);

  const chartData = useMemo(() => {
    const bookingsPerMonth = Array(12).fill(0);
    const passengersPerMonth = Array(12).fill(0);
    const revenuePerMonth = Array(12).fill(0);

    recentBookings.forEach((booking) => {
      const date = new Date(booking.bookedAt);
      const month = date.getMonth();

      bookingsPerMonth[month]++;
      passengersPerMonth[month] += booking.passengers?.length || 0;

      // ✅ Only count revenue if status is "paid"
      if (booking.status === "paid") {
        revenuePerMonth[month] += booking.totalPrice || 0;
      }
    });

    return bookingsPerMonth.map((_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      bookings: bookingsPerMonth[i],
      passengers: passengersPerMonth[i],
      revenue: revenuePerMonth[i],
    }));
  }, [recentBookings]);
  const totalRevenue = useMemo(() => {
    return recentBookings
      .filter((b) => b.status === "paid")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
      .toLocaleString();
  }, [recentBookings]);

  const cardItems = [
    { label: "Total Users", value: users, onClick: () => navigate("/admin/users") },
    { label: "Passengers", value: passengers, onClick: () => navigate("/admin/passengers") },
    { label: "Flights", value: flights, onClick: () => navigate("/admin/flights") },
    { label: "Revenue", value: `₱${totalRevenue}`, onClick: null },
  ];

  return (
    <div className="p-6 space-y-8 bg-violet-50 min-h-screen">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cardItems.map((card, i) => (
          <div
            key={i}
            onClick={card.onClick}
            className={`bg-white p-6 rounded-2xl shadow-md text-center transition duration-200 hover:shadow-xl ${
              card.onClick ? "cursor-pointer hover:bg-violet-50" : "cursor-default"
            }`}
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-violet-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Bookings Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-violet-800">Monthly Bookings</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#7c3aed" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#7c3aed" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Passengers Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-violet-800">Monthly Passengers</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#7c3aed" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="passengers" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-violet-800">Monthly Revenue</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#7c3aed" />
                <YAxis />
                <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-violet-800">Recent Bookings</h2>
        <div className="overflow-x-auto">
          {recentBookings.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No bookings found.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Trip</th>
                  <th className="py-2 px-3">Flights</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Price</th>
                  <th className="py-2 px-3">Booked At</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="border-b last:border-0 hover:bg-violet-50 transition">
                    <td className="py-2 px-3">
                      <div className="font-medium">{booking.fullName}</div>
                      <div className="text-xs text-gray-500">{booking.email}</div>
                    </td>
                    <td className="py-2 px-3 capitalize">{booking.tripType}</td>
                    <td className="py-2 px-3">
                      <div className="font-semibold">{booking.departureFlight?.flightNumber}</div>
                      <div className="text-xs text-gray-500">
                        {booking.departureFlight?.from} → {booking.departureFlight?.to}
                      </div>
                      {booking.tripType === "roundtrip" && booking.returnFlight && (
                        <div className="mt-1">
                          <div className="font-semibold">↩ {booking.returnFlight.flightNumber}</div>
                          <div className="text-xs text-gray-500">
                            {booking.returnFlight.from} → {booking.returnFlight.to}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          {
                            paid: "bg-green-100 text-green-700",
                            pending: "bg-yellow-100 text-yellow-700",
                            cancelled: "bg-red-100 text-red-700",
                            failed: "bg-gray-200 text-gray-500",
                          }[booking.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold text-violet-700">₱{booking.totalPrice.toLocaleString()}</td>
                    <td className="py-2 px-3 text-xs text-gray-500">{new Date(booking.bookedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
