import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import FlightCard from "../components/FlightCard";
import axios from "axios";

const FlightResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [outboundFlights, setOutboundFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);

  // Extract query params from URL
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const departure = searchParams.get("departure");
  const returnDate = searchParams.get("returnDate");
  const tripType = searchParams.get("tripType");

  const roundTrip = tripType === "round-trip";

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_API_BASEURL}/flights/search`, {
          from,
          to,
          departure,
          return: returnDate,
          tripType,
        });

        const results = res.data;
        setOutboundFlights(results.outbound || []);
        setReturnFlights(results.return || []);
      } catch (err) {
        console.error("Error fetching flight results:", err);
      }
    };

    if (from && to && departure) {
      fetchFlights();
    }
  }, [from, to, departure, returnDate, tripType]);

  const handleFlightSelect = (flight, type) => {
    if (!roundTrip) {
      navigate(`/flight/${flight._id}/one-way`);
      return;
    }

    if (type === "outbound") setSelectedOutbound(flight);
    else setSelectedReturn(flight);
  };

  const handleContinue = () => {
    navigate("/flight-summary/round-trip", {
      state: { selectedOutbound, selectedReturn },
    });
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 max-w-screen-xl mx-auto space-y-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-violet-700">Flight Results</h1>
        <button onClick={() => navigate("/")} className="text-sm text-violet-600 underline hover:text-violet-800">
          ← Back to Homepage
        </button>
      </div>

      {/* Results */}
      {roundTrip ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-2xl border border-violet-200 rounded-3xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-violet-700 mb-4 border-b pb-2">Select Outbound Flight</h2>
            {outboundFlights.length > 0 ? (
              outboundFlights.map((flight) => (
                <FlightCard
                  key={flight._id}
                  flight={flight}
                  isSelected={selectedOutbound?._id === flight._id}
                  onSelect={() => handleFlightSelect(flight, "outbound")}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No outbound flights found.</p>
            )}
          </div>

          <div className="bg-white/70 backdrop-blur-2xl border border-violet-200 rounded-3xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-violet-700 mb-4 border-b pb-2">Select Return Flight</h2>
            {returnFlights.length > 0 ? (
              returnFlights.map((flight) => (
                <FlightCard
                  key={flight._id}
                  flight={flight}
                  isSelected={selectedReturn?._id === flight._id}
                  onSelect={() => handleFlightSelect(flight, "return")}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No return flights found.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-2xl border border-violet-200 rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-violet-700 mb-4 border-b pb-2">Select Your Flight</h2>
          {outboundFlights.length > 0 ? (
            outboundFlights.map((flight) => (
              <FlightCard key={flight._id} flight={flight} onSelect={() => handleFlightSelect(flight, "oneway")} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No flights found.</p>
          )}
        </div>
      )}

      {roundTrip && selectedOutbound && selectedReturn && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
          <button
            onClick={handleContinue}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-indigo-400/50 transition-all duration-300"
          >
            Continue to Summary
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightResults;
