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
      className={`bg-white rounded shadow p-4 flex flex-col md:flex-row justify-between items-center gap-4 cursor-pointer transition border-2 ${
        isSelected ? "border-violet-600 bg-violet-50" : "border-transparent hover:border-violet-300"
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-4 w-full md:w-1/4">
        <img src={flight.logo || "/default-logo.png"} alt={flight.airline} className="h-10 w-10 object-contain" />
        <div>
          <p className="font-bold text-violet-600">{flight.airline}</p>
          <p className="text-sm text-gray-500">{flight.flightNumber}</p>
        </div>
      </div>

      <div className="text-center w-full md:w-1/4">
        <p className="text-gray-700 font-medium">
          {new Date(flight.departureTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          →{" "}
          {new Date(flight.arrivalTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="text-sm text-gray-500">
          {flight.from} → {flight.to}
        </p>
      </div>

      <div className="text-center w-full md:w-1/6">
        <p className="text-sm text-gray-600">Seats</p>
        <p className="font-medium">{flight.availableSeats}</p>
      </div>

      <div className="text-center w-full md:w-1/6">
        <p className="text-sm text-gray-600">Price</p>
        <p className="font-bold text-green-600">₱{flight.price.toLocaleString()}</p>
      </div>

      <div className="w-full md:w-auto">
        <button
          className={`px-4 py-2 rounded w-full transition ${
            onSelect
              ? isSelected
                ? "bg-violet-800 text-white"
                : "bg-violet-600 text-white hover:bg-violet-700"
              : "bg-violet-600 text-white hover:bg-violet-700"
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
  );
};

export default FlightCard;
