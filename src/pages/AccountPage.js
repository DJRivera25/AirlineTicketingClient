import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../context/UserContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Timer, BadgeCheck, CreditCard, CalendarDays, ArrowRight, RefreshCcw, Loader, XCircle } from "lucide-react";
import locations from "../data/Locations";

const countryToFlagCode = {
  Philippines: "ph",
  Japan: "jp",
  "South Korea": "kr",
  Singapore: "sg",
  Thailand: "th",
  "United Kingdom": "gb",
  Germany: "de",
  "United States": "us",
  Canada: "ca",
};

const flattenCities = () =>
  locations.flatMap((region) =>
    region.countries.flatMap((country) =>
      country.cities.map((city) => ({
        city: city.name,
        code: city.code,
        country: country.country,
        flag: `https://flagcdn.com/24x18/${countryToFlagCode[country.country]}.png`,
      }))
    )
  );

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
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(true);
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
          `${process.env.REACT_APP_API_BASEURL}/bookings/my-bookings`,
          { email: user.email },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const filtered = res.data.filter((b) => TABS.includes(b.status));
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
    const fetchPayments = async () => {
      try {
        setPaymentLoading(true);
        const res = await axios.get(`${process.env.REACT_APP_API_BASEURL}/payments`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPayments(res.data.payments || []);
      } catch (err) {
        console.error("Payment fetch error", err);
      } finally {
        setPaymentLoading(false);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updates = {};
      bookings.forEach((b) => {
        if (b.status === "paid" && b.departureFlight) {
          updates[b._id] = formatTimeLeft(b.departureFlight.departureTime);
        }
      });
      setCountdown(updates);
    }, 1000);
    return () => clearInterval(interval);
  }, [bookings]);

  const getTabCount = (status) => bookings.filter((b) => b.status === status).length;
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
          `${process.env.REACT_APP_API_BASEURL}/bookings/${bookingId}/status`,
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

  const filteredBookings = bookings.filter((b) => b.status === tab);

  const getPaymentForBooking = (bookingId) => payments.find((p) => p.booking?._id === bookingId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
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

      {loading ? (
        <p className="text-gray-500 animate-pulse flex items-center gap-2">
          <Loader className="animate-spin w-4 h-4" />
          Loading bookings...
        </p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-gray-400 italic">No {tab} bookings found.</p>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((b) => {
            const payment = getPaymentForBooking(b._id);
            return (
              <div
                key={b._id}
                className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 space-y-3 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-violet-700 flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5" /> Booking: {b._id}
                  </h2>
                  {b.status === "paid" && (
                    <span className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <Timer className="w-4 h-4" /> {countdown[b._id] || "Calculating..."}
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    <strong>{b.departureFlight?.from}</strong> to <strong>{b.departureFlight?.to}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Departure: {dayjs(b.departureFlight?.departureTime).format("MMM D, YYYY h:mm A")}
                  </div>
                  {b.returnFlight && (
                    <div className="flex items-center gap-2">
                      <RefreshCcw className="w-4 h-4" />
                      Return: {dayjs(b.returnFlight?.departureTime).format("MMM D, YYYY h:mm A")}
                    </div>
                  )}
                  <div className="capitalize flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4" />
                    Status:{" "}
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
                  {b.status === "paid" && payment && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4" />
                        Payment Method: <span className="ml-1 font-medium capitalize">{payment.method}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="w-4 h-4" />
                        Paid On: {dayjs(payment.paidAt).format("MMM D, YYYY h:mm A")}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {b.status === "paid" && (
                    <button
                      onClick={() => navigate(`/booking-confirmation/${b._id}`)}
                      className="w-full sm:w-auto bg-violet-500 hover:bg-violet-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
                    >
                      View Boarding Pass
                    </button>
                  )}
                  {b.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction("Pay", b._id)}
                        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
                      >
                        Pay Now
                      </button>
                      <button
                        onClick={() => handleAction("Cancel", b._id)}
                        className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" /> Cancel Booking
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccountPage;
