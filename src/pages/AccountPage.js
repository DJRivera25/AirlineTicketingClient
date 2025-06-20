import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/UserContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const TABS = ["pending", "paid", "past"];

const formatTimeLeft = (departure) => {
  const now = dayjs();
  const diff = dayjs(departure).diff(now, "second");
  if (diff <= 0) return "Departed";
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const AccountPage = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("paid");
  const [seenCounts, setSeenCounts] = useState({});
  const [countdown, setCountdown] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await axios.post(
          "http://localhost:4000/bookings/my-bookings",
          { email: user.email },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const filtered = res.data.filter((b) => ["pending", "paid", "past"].includes(b.status));
        setBookings(filtered);
      } catch (err) {
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user.email]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updates = {};
      bookings.forEach((b) => {
        if (b.status === "ongoing" && b.departureFlight) {
          updates[b._id] = formatTimeLeft(b.departureFlight.departureTime);
        }
      });
      setCountdown(updates);
    }, 1000);
    return () => clearInterval(interval);
  }, [bookings]);

  const handleTabClick = (t) => {
    setTab(t);
    setSeenCounts((prev) => ({ ...prev, [t]: true }));
  };

  const handleAction = (type, bookingId) => {
    if (type === "Pay") {
      navigate(`/payment/${bookingId}`);
    } else if (type === "Cancel") {
      axios
        .patch(
          `http://localhost:4000/bookings/${bookingId}/status`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then(() => {
          setBookings((prev) => prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b)));
        })
        .catch(() => alert("Failed to update booking status"));
    }
  };

  const getTabCount = (status) => bookings.filter((b) => b.status === status).length;

  const renderBooking = (b) => (
    <div
      key={b._id}
      className="bg-gradient-to-tr from-white to-violet-50 shadow-lg border border-violet-200 rounded-2xl p-6 hover:scale-[1.01] transition-transform duration-300 ease-in-out space-y-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-violet-800 tracking-tight">#{b._id.slice(-6)}</h3>
          <p className="text-sm text-gray-500 italic">{b.departureFlight?.airline}</p>
        </div>
        {b.status === "ongoing" && (
          <span className="text-sm font-medium text-red-600 animate-pulse bg-red-50 px-2 py-1 rounded">
            ⏳ {countdown[b._id] || "Calculating..."}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1 text-sm text-gray-700">
        <p>
          🛫 <strong>{b.departureFlight?.from}</strong> → <strong>{b.departureFlight?.to}</strong>
        </p>
        <p>📅 Departure: {dayjs(b.departureFlight?.departureTime).format("MMM D, YYYY h:mm A")}</p>
        {b.returnFlight && <p>🔁 Return: {dayjs(b.returnFlight?.departureTime).format("MMM D, YYYY h:mm A")}</p>}
        <p className="capitalize col-span-full sm:col-span-1">
          📌 Status: <span className="font-medium text-violet-600">{b.status}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mt-2">
        {b.status === "paid" && (
          <button
            onClick={() => navigate(`/booking-confirmation/${b._id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md text-sm font-semibold"
          >
            🧾 View Boarding Pass
          </button>
        )}
        {b.status === "pending" && (
          <>
            <button
              onClick={() => handleAction("Pay", b._id)}
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 shadow-md text-sm font-semibold"
            >
              💳 Pay Now
            </button>
            <button
              onClick={() => handleAction("Cancel", b._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-md text-sm font-semibold"
            >
              ❌ Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );

  const filteredBookings = bookings.filter((b) => b.status === tab);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-extrabold text-violet-700 tracking-tight text-center">✈️ My Bookings</h1>

      {/* Tabs */}
      <div className="flex justify-around gap-3 text-sm border-b pb-3">
        {TABS.map((t) => {
          const count = getTabCount(t);
          const isActive = tab === t;
          return (
            <button
              key={t}
              onClick={() => handleTabClick(t)}
              className={`relative capitalize px-4 py-1 rounded-full transition font-medium ${
                isActive ? "bg-violet-600 text-white shadow-md" : "text-gray-500 hover:text-violet-600"
              }`}
            >
              {t}
              {count > 0 && !seenCounts[t] && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold animate-bounce">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading bookings...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-gray-400 italic">No {tab} bookings found.</p>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 space-y-3 hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-violet-700">📄 Booking: {b._id}</h2>
                {b.status === "ongoing" && (
                  <span className="text-xs text-red-600 font-semibold">⏳ {countdown[b._id] || "Calculating..."}</span>
                )}
              </div>

              <div className="space-y-1 text-sm text-gray-700">
                <div>
                  ✈️ <strong>{b.departureFlight?.from}</strong> → <strong>{b.departureFlight?.to}</strong>
                </div>
                <div>📆 Departure: {dayjs(b.departureFlight?.departureTime).format("MMM D, YYYY h:mm A")}</div>
                {b.returnFlight && (
                  <div>🔁 Return: {dayjs(b.returnFlight?.departureTime).format("MMM D, YYYY h:mm A")}</div>
                )}
                <div className="capitalize">
                  📌 Status:
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      b.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : b.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {b.status === "paid" && (
                  <button
                    onClick={() => navigate(`/booking-confirmation/${b._id}`)}
                    className="w-full sm:w-auto bg-violet-500 hover:bg-violet-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
                  >
                    🧾 View Boarding Pass
                  </button>
                )}
                {b.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction("Pay", b._id)}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
                    >
                      💳 Pay Now
                    </button>
                    <button
                      onClick={() => handleAction("Cancel", b._id)}
                      className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
                    >
                      ❌ Cancel Booking
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountPage;
