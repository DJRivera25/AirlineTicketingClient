import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Loader, PlaneTakeoff, PlaneLanding, AlertTriangle, Users, Mail, Phone, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import UserContext from "../context/UserContext";
import SeatMap from "../components/SeatMap";

const BookingPage = () => {
  const { user } = useContext(UserContext);
  const { outboundId, returnId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loginWarning, setLoginWarning] = useState(false);
  const [outboundFlight, setOutboundFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [outboundSeatNumbers, setoutboundSeatNumbers] = useState([]);
  const [returnSeatNumbers, setreturnSeatNumbers] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    passengerCount: 1,
  });
  const [passengers, setPassengers] = useState([]);
  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };
  useEffect(() => {
    const fetch = async () => {
      try {
        const oFlight = await axios.get(`${process.env.REACT_APP_API_BASEURL}/flights/${outboundId}`);
        const oSeats = await axios.get(`${process.env.REACT_APP_API_BASEURL}/seats/flight/${outboundId}`);
        setOutboundFlight(oFlight.data);
        setoutboundSeatNumbers(oSeats.data);

        if (returnId) {
          const rFlight = await axios.get(`${process.env.REACT_APP_API_BASEURL}/flights/${returnId}`);
          const rSeats = await axios.get(`${process.env.REACT_APP_API_BASEURL}/seats/flight/${returnId}`);
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

  const handleSeatSelection = (flightType, seatNumber, unselectSeatNumber) => {
    const seatKey = `${flightType}SeatNumber`;
    const updatedPassengers = [...passengers];

    if (!seatNumber && unselectSeatNumber) {
      const passengerIndex = updatedPassengers.findIndex((p) => p[seatKey] === unselectSeatNumber);
      if (passengerIndex !== -1) {
        updatedPassengers[passengerIndex][seatKey] = "";
        setPassengers(updatedPassengers);
      }
      return;
    }

    const alreadyAssigned = passengers.find((p) => p[seatKey] === seatNumber);
    if (alreadyAssigned) {
      toast.warn("Seat already selected.");
      return;
    }

    const firstUnassignedIndex = updatedPassengers.findIndex((p) => !p[seatKey]);
    if (firstUnassignedIndex !== -1) {
      updatedPassengers[firstUnassignedIndex][seatKey] = seatNumber;
      setPassengers(updatedPassengers);
    } else {
      toast.warn("All passengers already have assigned seats.");
    }
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
      setTimeout(() => {
        navigate("/login", {
          state: { from: location.pathname }, // or use location.pathname + location.search if there are params
        });
      }, 3000);
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

      const response = await axios.post(`${process.env.REACT_APP_API_BASEURL}/bookings`, bookingData, {
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
      {!user?.id && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-red-100 border-t border-red-300 shadow-inner">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm font-medium text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              You must be logged in to confirm your booking.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-2 md:mt-0 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded shadow"
            >
              Login to Proceed
            </button>
          </div>
        </div>
      )}
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
              <label className="block text-sm font-medium text-violet-700">{label}</label>
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
        <h2 className="text-xl font-semibold text-violet-800 text-center">
          {" "}
          <CheckCircle className="inline-block mr-2 text-violet-600" /> Seat Selection
        </h2>
        <div className={`grid gap-6 ${returnFlight ? "md:grid-cols-2" : "justify-center"}`}>
          <div className={`${returnFlight ? "" : "md:col-span-2 max-w-xl mx-auto"}`}>
            <label className={`text-center ${returnFlight ? "block font-semibold mb-2" : "hidden"}`}>
              {" "}
              <PlaneTakeoff className="inline-block mr-2 text-violet-600" />
              <strong className="text-violet-800 text-center">Outbound </strong>{" "}
            </label>
            <SeatMap
              seats={outboundSeatNumbers}
              onSeatClick={(seatNumber, unselectSeatNumber) =>
                handleSeatSelection("outbound", seatNumber, unselectSeatNumber)
              }
              selectedSeatNumbers={passengers.map((p) => p.outboundSeatNumber)}
            />
          </div>
          {returnFlight && (
            <div>
              <label className="block font-semibold mb-2 text-center">
                {" "}
                <PlaneLanding className="inline-block mr-2 text-violet-600" />
                <strong className="text-violet-800 ">Return </strong>{" "}
              </label>
              <SeatMap
                seats={returnSeatNumbers}
                onSeatClick={(seatNumber, unselectSeatNumber) =>
                  handleSeatSelection("return", seatNumber, unselectSeatNumber)
                }
                selectedSeatNumbers={passengers.map((p) => p.returnSeatNumber)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Passenger Info */}
      <div className="bg-white p-6 rounded-xl shadow space-y-6 border border-violet-300">
        <h3 className="font-semibold text-2xl text-violet-800 border-b border-violet-200 pb-2">
          Passenger Information
        </h3>
        <div className="space-y-8">
          {passengers.map((p, index) => (
            <div
              key={index}
              className="border border-violet-300 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-violet-700">
                  {p.fullName ? p.fullName : `Passenger ${index + 1}`}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  value={p.fullName}
                  onChange={(val) => updatePassenger(index, "fullName", val)}
                  placeholder="e.g. Juan Dela Cruz"
                />
                <InputField
                  label="Birthdate"
                  type="date"
                  value={p.birthdate}
                  onChange={(val) => updatePassenger(index, "birthdate", val)}
                />
                <InputField
                  label="Passport Number"
                  value={p.passportNumber}
                  onChange={(val) => updatePassenger(index, "passportNumber", val)}
                  placeholder="e.g. P1234567"
                />
                <InputField
                  label="Nationality"
                  value={p.nationality}
                  onChange={(val) => updatePassenger(index, "nationality", val)}
                  placeholder="e.g. Filipino"
                />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="p-3 bg-white border border-violet-200 rounded-lg">
                  <span className="font-semibold block text-gray-500">Outbound Seat</span>
                  <span className="text-violet-700 font-bold">{p.outboundSeatNumber || "Not selected"}</span>
                </div>
                {returnId && (
                  <div className="p-3 bg-white border border-violet-200 rounded-lg">
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
      {user?.id ? (
        <button
          onClick={handleBooking}
          className="w-full py-3 text-lg font-semibold text-white rounded-md transition duration-200 bg-gradient-to-r from-violet-600 via-violet-700 to-indigo-800 hover:from-violet-700 hover:to-indigo-900 shadow-md"
        >
          Confirm & Proceed
        </button>
      ) : null}
    </div>
  );
};

const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-violet-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
    />
  </div>
);

export default BookingPage;
