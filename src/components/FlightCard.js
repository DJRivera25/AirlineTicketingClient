import React from "react";

const FlightCard = ({ flight, isSelected, onSelect, viewFlightDetails }) => {
  const handleClick = () => {
    if (onSelect) {
      onSelect();
    } else {
      viewFlightDetails?.(flight._id);
    }
  };

  return (
    <div
      className={`w-full bg-white/70 backdrop-blur-xl border ${
        isSelected ? "border-violet-600 bg-violet-50/70" : "border-violet-200 hover:border-violet-400"
      } rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex flex-col gap-4 p-5 sm:p-6`}
      onClick={handleClick}
    >
      {/* Top Row: Airline and Route */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* Airline */}
        <div className="flex items-center gap-4">
          <img src={flight.logo || "/default-logo.png"} alt={flight.airline} className="h-10 w-10 object-contain" />
          <div>
            <p className="font-semibold text-violet-700">{flight.airline}</p>
            <p className="text-xs text-gray-500">{flight.flightNumber}</p>
          </div>
        </div>

        {/* Route + Times */}
        <div className="text-sm text-gray-800 text-center sm:text-right">
          <p className="font-medium">
            {new Date(flight.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} →{" "}
            {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="text-gray-500">
            {flight.from} → {flight.to}
          </p>
        </div>
      </div>

      {/* Bottom Row: Price, Seats, Button */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mt-2">
        {/* Available Seats */}
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-500">Available Seats</p>
          <p className="font-semibold text-gray-800">{flight.availableSeats}</p>
        </div>

        {/* Price */}
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-500">Price</p>
          <p className="font-bold text-green-600 text-lg">₱{flight.price.toLocaleString()}</p>
        </div>

        {/* Button */}
        <div className="text-center sm:text-right">
          <button
            className={`w-full sm:w-auto px-5 py-2 rounded-xl font-medium transition ${
              onSelect
                ? isSelected
                  ? "bg-violet-800 text-white"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            {onSelect ? (isSelected ? "Selected" : "Select") : "View Details"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
