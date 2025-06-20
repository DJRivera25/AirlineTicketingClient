import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Plane, Clock, MapPin, Briefcase, Info, ArrowLeft, ArrowRight } from "lucide-react";

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goBackToSearch = () => {
    navigate("/flights");
  };

  const continueToBooking = () => {
    navigate(`/booking/${id}`);
  };

  const calculateDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/flights/${id}`);
        setFlight(res.data);
      } catch (err) {
        setError("Unable to load flight details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading flight details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!flight) return <p className="text-center text-gray-500">Flight not found.</p>;

  const {
    flightNumber,
    airline,
    from,
    to,
    departureTime,
    arrivalTime,
    aircraft = "Airbus A330-300",
    seatCapacity,
  } = flight;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-violet-700 flex items-center gap-2">
          <Plane className="w-7 h-7" /> Flight Details
        </h1>
        <button
          className="text-sm flex items-center gap-1 text-violet-600 hover:text-violet-800 underline"
          onClick={goBackToSearch}
        >
          <ArrowLeft size={16} /> Back to Search
        </button>
      </div>

      {/* Itinerary */}
      <section className="bg-white p-6 shadow-lg rounded-xl space-y-2 border">
        <div className="flex items-center gap-2 text-violet-600 font-semibold text-lg">
          <MapPin size={18} /> Itinerary
        </div>
        <p>
          <strong>Flight:</strong> {airline} {flightNumber}
        </p>
        <p>
          <strong>Route:</strong> {from} → {to}
        </p>
        <p>
          <strong>Departure:</strong> {new Date(departureTime).toLocaleString()}
        </p>
        <p>
          <strong>Arrival:</strong> {new Date(arrivalTime).toLocaleString()}
        </p>
        <p className="text-sm text-gray-700">
          <Clock className="inline-block w-4 h-4" /> <strong>Duration:</strong>{" "}
          {calculateDuration(departureTime, arrivalTime)}
        </p>
      </section>

      {/* Baggage */}
      <section className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
        <div className="flex items-center gap-2 text-violet-600 font-semibold text-lg">
          <Briefcase size={18} /> Baggage Allowance
        </div>
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
          <li>1 carry-on bag (7kg max)</li>
          <li>1 checked baggage (up to 20kg)</li>
          <li>Additional baggage fees apply beyond limit</li>
        </ul>
      </section>

      {/* In-flight Services */}
      <section className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
        <div className="flex items-center gap-2 text-violet-600 font-semibold text-lg">
          <Info size={18} /> In-flight Services
        </div>
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
          <li>Complimentary meals and beverages</li>
          <li>Wi-Fi (limited availability)</li>
          <li>Entertainment system with movies/music</li>
          <li>Power outlets at each seat</li>
        </ul>
      </section>

      {/* Aircraft */}
      <section className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
        <h2 className="text-lg font-semibold text-violet-600 flex items-center gap-2">
          <Plane size={18} /> Aircraft Info
        </h2>
        <p>
          <strong>Model:</strong> {aircraft}
        </p>
        <p>
          <strong>Seats Available:</strong> {seatCapacity}
        </p>
      </section>

      {/* Seat Map */}
      <section className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
        <h2 className="text-lg font-semibold text-violet-600 flex items-center gap-2">
          <MapPin size={18} /> Seat Map Preview
        </h2>
        <div className="border rounded p-4 text-center text-gray-500 italic">
          [Seat map image or interactive preview goes here]
        </div>
      </section>

      {/* Terms */}
      <section className="bg-white p-6 shadow-lg rounded-xl border space-y-2">
        <h2 className="text-lg font-semibold text-violet-600 flex items-center gap-2">
          <Info size={18} /> Terms & Conditions
        </h2>
        <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
          <li>Ticket is non-refundable after purchase.</li>
          <li>Rebooking allowed with applicable fees.</li>
          <li>Passenger must check in 2 hours before departure.</li>
          <li>Passport validity must be at least 6 months from travel date.</li>
          <li>All flight details subject to change without prior notice.</li>
        </ul>
      </section>

      {/* Continue Button */}
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

export default FlightDetails;
