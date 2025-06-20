import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader, PlaneTakeoff, PlaneLanding, AlertTriangle, Users, Mail, Phone } from "lucide-react";
import { toast } from "react-toastify";
import UserContext from "../context/UserContext";
import SeatMap from "../components/SeatMap";

const BookingPage = () => {
  const { user } = useContext(UserContext);
  const { outboundId, returnId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [loginWarning, setLoginWarning] = useState(false);
  const [outboundFlight, setOutboundFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [outboundSeatNumbers, setoutboundSeatNumbers] = useState([]);
  const [returnSeatNumbers, setreturnSeatNumbers] = useState([]);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", passengerCount: 1 });
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const oFlight = await axios.get(`http://localhost:4000/flights/${outboundId}`);
        const oSeats = await axios.get(`http://localhost:4000/seats/flight/${outboundId}`);
        setOutboundFlight(oFlight.data);
        setoutboundSeatNumbers(oSeats.data);

        if (returnId) {
          const rFlight = await axios.get(`http://localhost:4000/flights/${returnId}`);
          const rSeats = await axios.get(`http://localhost:4000/seats/flight/${returnId}`);
          setReturnFlight(rFlight.data);
          setreturnSeatNumbers(rSeats.data);
        }

        setForm({
          fullName: user.fullName,
          email: user.email,
          phone: user.mobileNo || "",
          passengerCount: 1,
        });

        setPassengers([
          {
            fullName: "",
            birthdate: "",
            passportNumber: "",
            nationality: "",
            outboundSeatNumber: "",
            returnSeatNumber: "",
          },
        ]);
      } catch (e) {
        toast.error("Failed to load flight or seat data.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [outboundId, returnId, user]);

  const handleSeatSelection = (flightType, seatNumber) => {
    const seatKey = `${flightType}SeatNumber`;
    const seats = flightType === "outbound" ? [...outboundSeatNumbers] : [...returnSeatNumbers];

    const updatedSeats = seats.map((seat) => {
      if (seat.seatNumber === seatNumber) {
        if (seat.isBooked) {
          toast.warn("Seat already booked.");
          return seat;
        }

        const alreadySelected = passengers.some((p) => p[seatKey] === seatNumber);
        if (alreadySelected) {
          toast.warn("Seat already selected.");
          return seat;
        }

        const updatedPassengers = [...passengers];
        const idx = updatedPassengers.findIndex((p) => !p[seatKey]);
        if (idx !== -1) {
          updatedPassengers[idx][seatKey] = seatNumber;
          setPassengers(updatedPassengers);
        }
      }
      return seat;
    });

    if (flightType === "outbound") setoutboundSeatNumbers(updatedSeats);
    else setreturnSeatNumbers(updatedSeats);
  };

  const handleCountChange = (e) => {
    const count = Math.max(1, parseInt(e.target.value));
    setForm((prev) => ({ ...prev, passengerCount: count }));
    setPassengers((prev) => {
      const newList = Array.from({ length: count }, (_, i) => ({
        fullName: prev[i]?.fullName || "",
        birthdate: prev[i]?.birthdate || "",
        passportNumber: prev[i]?.passportNumber || "",
        nationality: prev[i]?.nationality || "",
        outboundSeatNumber: prev[i]?.outboundSeatNumber || "",
        returnSeatNumber: prev[i]?.returnSeatNumber || "",
      }));
      return newList;
    });
  };

  const handleBooking = async () => {
    if (!user.id) {
      setLoginWarning(true);
      toast.warn("Please log in to proceed with booking. Redirecting...");
      setTimeout(() => navigate(`/login`), 3000);
      return;
    }

    try {
      const tripType = returnId ? "roundtrip" : "oneway";

      const bookingData = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        tripType,
        departureFlight: outboundId,
        returnFlight: tripType === "roundtrip" ? returnId : null,
        passengers: passengers.map((p) => ({
          fullName: p.fullName,
          birthdate: p.birthdate,
          passportNumber: p.passportNumber,
          nationality: p.nationality,
          outboundSeatNumber: p.outboundSeatNumber,
          returnSeatNumber: tripType === "roundtrip" ? p.returnSeatNumber : null,
        })),
      };

      const response = await axios.post("http://localhost:4000/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Booking created successfully!");
      navigate(`/payment/${response.data._id}`);
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to create booking. Please try again.");
    }
  };

  if (loading) return <Loader className="animate-spin text-violet-600 w-12 h-12 mx-auto mt-20" />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Flight Summary */}
      <div className="flex flex-col md:flex-row gap-4">
        {outboundFlight && (
          <div className="flex-1 p-4 bg-white rounded shadow border border-violet-300">
            <PlaneTakeoff className="inline-block mr-2 text-violet-600" />
            <strong>Outbound:</strong> {outboundFlight.flightNumber}
          </div>
        )}
        {returnFlight && (
          <div className="flex-1 p-4 bg-white rounded shadow border border-violet-300">
            <PlaneLanding className="inline-block mr-2 text-violet-600" />
            <strong>Return:</strong> {returnFlight.flightNumber}
          </div>
        )}
      </div>

      {/* Contact Info */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4 border border-gray-200">
        <h2 className="text-xl font-semibold text-violet-800 flex items-center gap-2">
          <Users /> Contact Information
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: "Full Name", field: "fullName", icon: Users },
            { label: "Email", field: "email", icon: Mail },
            { label: "Phone", field: "phone", icon: Phone },
            { label: "Passengers", field: "passengerCount", icon: Users },
          ].map(({ label, field, icon: Icon }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-600">{label}</label>
              <div className="relative">
                <input
                  type={field === "email" ? "email" : field === "passengerCount" ? "number" : "text"}
                  min={1}
                  value={form[field]}
                  onChange={(e) =>
                    field === "passengerCount"
                      ? handleCountChange(e)
                      : setForm((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                  className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <Icon className="absolute top-2.5 left-2.5 text-gray-400 w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Selection */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-violet-800">Seat Selection</h2>
        <div className={`grid gap-6 ${returnFlight ? "md:grid-cols-2" : "justify-center"}`}>
          <div className={`${returnFlight ? "" : "md:col-span-2 max-w-xl mx-auto"}`}>
            <label className={`${returnFlight ? "block font-semibold mb-2" : "hidden"}`}>Outbound Seats</label>
            <SeatMap
              seats={outboundSeatNumbers}
              onSeatClick={(seatNumber) => handleSeatSelection("outbound", seatNumber)}
              selectedSeatNumbers={passengers.map((p) => p.outboundSeatNumber)}
            />
          </div>
          {returnFlight && (
            <div>
              <label className="block font-semibold mb-2">Return Seats</label>
              <SeatMap
                seats={returnSeatNumbers}
                onSeatClick={(seatNumber) => handleSeatSelection("return", seatNumber)}
                selectedSeatNumbers={passengers.map((p) => p.returnSeatNumber)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Passenger Info */}
      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <h3 className="font-semibold text-2xl text-gray-800 border-b pb-2">✈️ Passenger Information</h3>
        <div className="space-y-8">
          {passengers.map((p, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-violet-700">
                  {p.fullName ? p.fullName : `Passenger ${index + 1}`}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={p.fullName}
                    onChange={(e) => {
                      const updated = [...passengers];
                      updated[index].fullName = e.target.value;
                      setPassengers(updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g. Juan Dela Cruz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Birthdate</label>
                  <input
                    type="date"
                    value={p.birthdate}
                    onChange={(e) => {
                      const updated = [...passengers];
                      updated[index].birthdate = e.target.value;
                      setPassengers(updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Passport Number</label>
                  <input
                    type="text"
                    value={p.passportNumber}
                    onChange={(e) => {
                      const updated = [...passengers];
                      updated[index].passportNumber = e.target.value;
                      setPassengers(updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g. P1234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={p.nationality}
                    onChange={(e) => {
                      const updated = [...passengers];
                      updated[index].nationality = e.target.value;
                      setPassengers(updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="e.g. Filipino"
                  />
                </div>
              </div>

              {/* Seat Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                  <span className="font-semibold block text-gray-500">Outbound Seat</span>
                  <span className="text-violet-700 font-bold">{p.outboundSeatNumber || "Not selected"}</span>
                </div>
                {returnId && (
                  <div className="p-3 bg-white border border-gray-200 rounded-lg">
                    <span className="font-semibold block text-gray-500">Return Seat</span>
                    <span className="text-violet-700 font-bold">{p.returnSeatNumber || "Not selected"}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login Warning */}
      {loginWarning && (
        <div className="flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded">
          <AlertTriangle /> Please log in to proceed.
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleBooking}
        className="w-full py-3 text-lg font-semibold bg-violet-700 hover:bg-violet-800 text-white rounded-md transition duration-200"
      >
        Confirm & Proceed
      </button>
    </div>
  );
};

export default BookingPage;
