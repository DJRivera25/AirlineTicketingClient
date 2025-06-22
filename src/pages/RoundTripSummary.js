import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Briefcase, Clock, Plane, MapPin, Info } from "lucide-react";
import SeatMap from "../components/SeatMap";
import axios from "axios";

const RoundTripSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedOutbound, selectedReturn } = state || {};

  const [outboundSeatNumberMap, setOutboundSeatNumberMap] = useState([]);
  const [returnSeatNumberMap, setReturnSeatNumberMap] = useState([]);

  const formatDate = (datetime) => new Date(datetime).toLocaleString();

  const goBackToSearch = () => navigate("/flights");

  const continueToBooking = () => {
    navigate(`/booking/${selectedOutbound._id}/${selectedReturn._id}`);
  };

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        if (selectedOutbound?._id) {
          const res = await axios.get(`${process.env.REACT_APP_API_BASEURL}/seats/flight/${selectedOutbound._id}`);
          setOutboundSeatNumberMap(res.data);
        }
        if (selectedReturn?._id) {
          const res = await axios.get(`${process.env.REACT_APP_API_BASEURL}/seats/flight/${selectedReturn._id}`);
          setReturnSeatNumberMap(res.data);
        }
      } catch (error) {
        setOutboundSeatNumberMap([]);
        setReturnSeatNumberMap([]);
      }
    };

    fetchSeats();
  }, [selectedOutbound, selectedReturn]);

  if (!selectedOutbound || !selectedReturn) {
    return <div className="text-center text-gray-500 p-6">Missing flight data. Please go back and select flights.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-violet-800 tracking-tight">Roundtrip Summary</h1>
        <button
          onClick={goBackToSearch}
          className="text-sm flex items-center gap-1 text-violet-600 hover:text-violet-800 underline"
        >
          <ArrowLeft size={16} /> Back to Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <FlightCard flight={selectedOutbound} title="Outbound Flight" />
          <AircraftCard flight={selectedOutbound} />
          <div className="overflow-x-auto">
            <SeatMap seats={outboundSeatNumberMap} selectedSeatNumbers={[]} onSeatClick={null} />
          </div>
        </div>

        <div className="space-y-6">
          <FlightCard flight={selectedReturn} title="Return Flight" />
          <AircraftCard flight={selectedReturn} />
          <div className="overflow-x-auto">
            <SeatMap seats={returnSeatNumberMap} selectedSeatNumbers={[]} onSeatClick={null} />
          </div>
        </div>
      </div>

      <InfoCard
        icon={<Briefcase size={18} />}
        title="Baggage Allowance"
        items={[
          "1 carry-on bag (7kg max)",
          "1 checked baggage (up to 20kg)",
          "Additional baggage fees apply beyond limit",
        ]}
      />

      <InfoCard
        icon={<Info size={18} />}
        title="In-flight Services"
        items={[
          "Complimentary meals and beverages",
          "Wi-Fi (limited availability)",
          "Entertainment system with movies/music",
          "Power outlets at each seat",
        ]}
      />

      <InfoCard
        icon={<Info size={18} />}
        title="Reminders & Terms"
        items={[
          "Ticket is non-refundable after purchase.",
          "Rebooking allowed with applicable fees.",
          "Passenger must check in 2 hours before departure.",
          "Passport validity must be at least 6 months from travel date.",
          "All flight details subject to change without prior notice.",
        ]}
        textSize="text-sm"
      />

      <div className="text-right">
        <button
          onClick={continueToBooking}
          className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-3 rounded-full shadow-md transition flex items-center gap-2"
        >
          Continue to Booking <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

const FlightCard = ({ flight, title }) => (
  <div className="p-6 bg-white rounded-xl shadow border border-violet-200">
    <h2 className="text-violet-800 flex items-center gap-2 text-lg font-semibold">
      <MapPin size={18} /> {title}
    </h2>
    <div className="space-y-1 text-sm mt-2">
      <div>
        <strong>From:</strong> {flight.from}
      </div>
      <div>
        <strong>To:</strong> {flight.to}
      </div>
      <div>
        <strong>Departure:</strong> {new Date(flight.departureTime).toLocaleString()}
      </div>
      <div>
        <strong>Arrival:</strong> {new Date(flight.arrivalTime).toLocaleString()}
      </div>
      <div>
        <strong>Airline:</strong> {flight.airline}
      </div>
      <div>
        <strong>Price:</strong> ₱{flight.price.toLocaleString()}
      </div>
      <div className="flex items-center gap-2 text-gray-700 mt-2">
        <Clock className="w-4 h-4" />
        <span className="text-sm">
          <strong>Duration:</strong> {flight.duration}
        </span>
      </div>
    </div>
  </div>
);

const AircraftCard = ({ flight }) => (
  <div className="p-6 bg-white rounded-xl shadow border border-violet-200">
    <h2 className="text-violet-800 flex items-center gap-2 text-lg font-semibold">
      <Plane size={18} /> Aircraft Info
    </h2>
    <div className="space-y-1 text-sm mt-2">
      <div>
        <strong>Model:</strong> {flight.aircraft || "N/A"}
      </div>
      <div>
        <strong>Seats Available:</strong> {flight.seatCapacity || "N/A"}
      </div>
    </div>
  </div>
);

const InfoCard = ({ icon, title, items, textSize = "text-base" }) => (
  <div className="p-6 bg-white rounded-xl shadow border border-violet-200">
    <h2 className={`text-violet-800 flex items-center gap-2 font-semibold ${textSize}`}>
      {icon} {title}
    </h2>
    <ul className="list-disc ml-5 space-y-1 text-gray-700 mt-2">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

export default RoundTripSummary;
