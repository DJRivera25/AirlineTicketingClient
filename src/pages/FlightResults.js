import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlightCard from "../components/FlightCard";
import SearchContext from "../context/FlightSearchContext";

const FlightResults = () => {
  const navigate = useNavigate();
  const { searchResults, searchQuery } = useContext(SearchContext);

  const roundTrip = !!searchQuery?.return;
  const outboundFlights = searchResults?.outbound || [];
  const returnFlights = searchResults?.return || [];

  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);

  const goToHomepage = () => navigate("/");

  const handleSort = (e) => {
    const sortBy = e.target.value;
    const sortFunc = (a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "departure":
          return new Date(a.departureTime) - new Date(b.departureTime);
        case "duration":
          const aDuration = new Date(a.arrivalTime) - new Date(a.departureTime);
          const bDuration = new Date(b.arrivalTime) - new Date(b.departureTime);
          return aDuration - bDuration;
        default:
          return 0;
      }
    };
    outboundFlights.sort(sortFunc);
    returnFlights.sort(sortFunc);
  };

  const handleFlightSelect = (flight, type) => {
    if (!roundTrip) {
      navigate(`/flight/${flight._id}/one-way`);
      return;
    }
    if (type === "outbound") {
      setSelectedOutbound(flight);
    } else {
      setSelectedReturn(flight);
    }
  };

  const handleContinue = () => {
    navigate("/flight-summary/round-trip", {
      state: {
        selectedOutbound,
        selectedReturn,
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-violet-700">Flight Results</h1>
        <button onClick={goToHomepage} className="text-sm text-violet-600 underline hover:text-violet-800">
          ← Back to Homepage
        </button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-4 flex-wrap items-center">
          <select className="border rounded-md px-3 py-2 shadow-sm text-sm focus:ring-violet-500 focus:border-violet-500">
            <option>All Airlines</option>
            <option>Philippine Airlines</option>
            <option>Cebu Pacific</option>
          </select>
          <select className="border rounded-md px-3 py-2 shadow-sm text-sm focus:ring-violet-500 focus:border-violet-500">
            <option>All Stops</option>
            <option>Direct</option>
            <option>1 Stop</option>
          </select>
          <select className="border rounded-md px-3 py-2 shadow-sm text-sm focus:ring-violet-500 focus:border-violet-500">
            <option>All Classes</option>
            <option>Economy</option>
            <option>Business</option>
          </select>
        </div>

        <div>
          <select
            onChange={handleSort}
            className="border rounded-md px-3 py-2 shadow-sm text-sm focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="">Sort by</option>
            <option value="price">Price (Low to High)</option>
            <option value="duration">Duration (Shortest)</option>
            <option value="departure">Departure Time (Earliest)</option>
          </select>
        </div>
      </div>

      {/* Flight Cards */}
      {roundTrip ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold text-violet-700 mb-4 border-b pb-2">Select Outbound Flight</h2>
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

          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold text-violet-700 mb-4 border-b pb-2">Select Return Flight</h2>
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
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold text-violet-700 mb-4 border-b pb-2">Select Your Flight</h2>
          {outboundFlights.length > 0 ? (
            outboundFlights.map((flight) => (
              <FlightCard key={flight._id} flight={flight} onSelect={() => handleFlightSelect(flight, "oneway")} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No flights found.</p>
          )}
        </div>
      )}

      {/* Continue Button */}
      {roundTrip && selectedOutbound && selectedReturn && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
          <button
            onClick={handleContinue}
            className="bg-violet-700 hover:bg-violet-800 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-200"
          >
            Continue to Summary
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightResults;
