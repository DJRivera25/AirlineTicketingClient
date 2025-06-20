import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, Clock, Plane, MapPin, Info } from "lucide-react";
import SeatMap from "../components/SeatMap";
import axios from "axios";

const RoundTripSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedOutbound, selectedReturn } = state || {};

  const [outboundSeatNumberMap, setoutboundSeatNumberMap] = useState([]);
  const [returnSeatNumberMap, setreturnSeatNumberMap] = useState([]);

  const formatDate = (datetime) => new Date(datetime).toLocaleString();

  const calculateDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr - dep;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const goBackToSearch = () => navigate("/flights");

  const continueToBooking = () => {
    const outboundId = selectedOutbound._id;
    const returnId = selectedReturn._id;
    navigate(`/booking/${outboundId}/${returnId}`);
  };

  useEffect(() => {
    if (selectedOutbound?._id) {
      axios
        .get(`http://localhost:4000/seats/flight/${selectedOutbound._id}`)
        .then((res) => setoutboundSeatNumberMap(res.data))
        .catch(() => setoutboundSeatNumberMap([]));
    }
    if (selectedReturn?._id) {
      axios
        .get(`http://localhost:4000/seats/flight/${selectedReturn._id}`)
        .then((res) => setreturnSeatNumberMap(res.data))
        .catch(() => setreturnSeatNumberMap([]));
    }
  }, [selectedOutbound, selectedReturn]);

  if (!selectedOutbound || !selectedReturn) {
    return <div className="text-center text-gray-500 p-6">Missing flight data. Please go back and select flights.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-violet-700 flex items-center gap-2">
          <Plane className="w-6 h-6" /> Roundtrip Summary
        </h1>
        <button
          onClick={goBackToSearch}
          className="text-sm flex items-center gap-1 text-violet-600 hover:text-violet-800 underline"
        >
          <ArrowLeft size={16} /> Back to Search
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Outbound */}
        <div className="space-y-6">
          <div className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
            <h2 className="text-lg font-semibold text-violet-600 flex items-center gap-2">
              <MapPin size={18} /> Outbound Flight
            </h2>
            <p>
              <strong>From:</strong> {selectedOutbound.from}
            </p>
            <p>
              <strong>To:</strong> {selectedOutbound.to}
            </p>
            <p>
              <strong>Departure:</strong> {formatDate(selectedOutbound.departureTime)}
            </p>
            <p>
              <strong>Arrival:</strong> {formatDate(selectedOutbound.arrivalTime)}
            </p>
            <p>
              <strong>Airline:</strong> {selectedOutbound.airline}
            </p>
            <p>
              <strong>Price:</strong> ₱{selectedOutbound.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-700">
              <Clock className="inline w-4 h-4" /> <strong>Duration:</strong>{" "}
              {calculateDuration(selectedOutbound.departureTime, selectedOutbound.arrivalTime)}
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
            <h2 className="text-lg font-semibold text-violet-600 flex items-center gap-2">
              <Plane size={18} /> Aircraft Info
            </h2>
            <p>
              <strong>Model:</strong> {selectedOutbound.aircraft || "N/A"}
            </p>
            <p>
              <strong>Seats Available:</strong> {selectedOutbound.seatCapacity || "N/A"}
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
            <h2 className="text-lg font-semibold text-violet-600 flex items-center gap-2">
              <MapPin size={18} /> Seat Map Preview
            </h2>
            <SeatMap seats={outboundSeatNumberMap} onSeatClick={() => {}} />
          </div>
        </div>

        {/* Return */}
        <div className="space-y-6">
          <div className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
            <h2 className="text-lg font-semibold text-violet-600 flex items-center gap-2">
              <MapPin size={18} /> Return Flight
            </h2>
            <p>
              <strong>From:</strong> {selectedReturn.from}
            </p>
            <p>
              <strong>To:</strong> {selectedReturn.to}
            </p>
            <p>
              <strong>Departure:</strong> {formatDate(selectedReturn.departureTime)}
            </p>
            <p>
              <strong>Arrival:</strong> {formatDate(selectedReturn.arrivalTime)}
            </p>
            <p>
              <strong>Airline:</strong> {selectedReturn.airline}
            </p>
            <p>
              <strong>Price:</strong> ₱{selectedReturn.price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-700">
              <Clock className="inline w-4 h-4" /> <strong>Duration:</strong>{" "}
              {calculateDuration(selectedReturn.departureTime, selectedReturn.arrivalTime)}
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
            <h2 className="text-lg font-semibold text-violet-600 flex items-center gap-2">
              <Plane size={18} /> Aircraft Info
            </h2>
            <p>
              <strong>Model:</strong> {selectedReturn.aircraft || "N/A"}
            </p>
            <p>
              <strong>Seats Available:</strong> {selectedReturn.seatCapacity || "N/A"}
            </p>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
            <h2 className="text-lg font-semibold text-violet-600 flex items-center gap-2">
              <MapPin size={18} /> Seat Map Preview
            </h2>
            <SeatMap seats={returnSeatNumberMap} onSeatClick={() => {}} />
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
        <div className="flex items-center gap-2 text-violet-600 font-semibold text-lg">
          <Briefcase size={18} /> Baggage Allowance
        </div>
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
          <li>1 carry-on bag (7kg max)</li>
          <li>1 checked baggage (up to 20kg)</li>
          <li>Additional baggage fees apply beyond limit</li>
        </ul>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
        <div className="flex items-center gap-2 text-violet-600 font-semibold text-lg">
          <Info size={18} /> In-flight Services
        </div>
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
          <li>Complimentary meals and beverages</li>
          <li>Wi-Fi (limited availability)</li>
          <li>Entertainment system with movies/music</li>
          <li>Power outlets at each seat</li>
        </ul>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
        <h2 className="text-lg font-semibold text-violet-600 flex items-center gap-2">
          <Info size={18} /> Reminders & Terms
        </h2>
        <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
          <li>Ticket is non-refundable after purchase.</li>
          <li>Rebooking allowed with applicable fees.</li>
          <li>Passenger must check in 2 hours before departure.</li>
          <li>Passport validity must be at least 6 months from travel date.</li>
          <li>All flight details subject to change without prior notice.</li>
        </ul>
      </div>

      <div className="text-right">
        <button
          onClick={continueToBooking}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-full shadow-lg transition flex items-center gap-2"
        >
          Continue to Booking <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default RoundTripSummary;
