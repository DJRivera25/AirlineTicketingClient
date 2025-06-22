import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { User, CheckCircle, XCircle } from "lucide-react";

const SeatMap = ({ seats, onSeatClick, selectedSeatNumbers = [] }) => {
  if (!seats || seats.length === 0) {
    return <p className="text-center text-gray-400 text-sm mt-6">No seats available for this flight.</p>;
  }

  const seatsPerRow = 6;
  const sortedSeats = [...seats].sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber));
  const totalRows = Math.ceil(sortedSeats.length / seatsPerRow);
  const seatMap = [];

  for (let row = 0; row < totalRows; row++) {
    const rowSeats = [];

    for (let col = 0; col < seatsPerRow; col++) {
      const index = row * seatsPerRow + col;
      if (index >= sortedSeats.length) break;

      const seat = sortedSeats[index];
      const isBooked = seat.isBooked;
      const isSelected = selectedSeatNumbers.includes(seat.seatNumber);

      let baseColor = "bg-violet-600 text-white";
      if (isBooked) baseColor = "bg-gray-300 text-gray-500 cursor-not-allowed";
      else if (isSelected) baseColor = "bg-yellow-400 text-white ring-2 ring-white shadow";

      const seatClasses = `
        w-9 h-9 md:w-10 md:h-10
        rounded-md flex items-center justify-center
        font-semibold text-[10px] md:text-xs
        transition-all duration-200
        ${!isBooked ? "hover:scale-105 cursor-pointer" : "opacity-80"}
        ${baseColor}
        shadow-sm
      `;

      const tooltipText = isBooked ? "Seat is booked" : isSelected ? "Selected seat" : "Available seat";

      const seatButton = (
        <button
          key={seat._id}
          disabled={isBooked || !onSeatClick}
          onClick={() => {
            if (!isBooked && onSeatClick) {
              if (isSelected) {
                onSeatClick(null, seat.seatNumber);
              } else {
                onSeatClick(seat.seatNumber);
              }
            }
          }}
          className={seatClasses}
          aria-label={`Seat ${seat.seatNumber}`}
        >
          {seat.seatNumber}
        </button>
      );

      rowSeats.push(
        <Tippy
          key={`tip-${seat._id}`}
          content={<div className="bg-neutral-900 text-white text-xs px-2 py-1 rounded shadow">{tooltipText}</div>}
          animation="shift-away"
          delay={[100, 0]}
        >
          <div>{seatButton}</div>
        </Tippy>
      );

      if (col === 2) {
        rowSeats.push(<div key={`aisle-${row}-${col}`} className="w-2" />);
      }
    }

    seatMap.push(
      <div key={`row-${row}`} className="flex gap-1 md:gap-2 justify-center mb-1">
        {rowSeats}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 px-2">
      {/* Title */}
      <h2 className="text-lg md:text-xl font-semibold text-center text-violet-700 mb-2">
        {onSeatClick ? "Select Your Seat" : "Seat Preview"}
      </h2>

      {/* Legend */}
      <div className="flex justify-center gap-4 md:gap-6 mb-3 text-xs md:text-sm font-medium">
        <Legend icon={<CheckCircle className="text-violet-600 w-4 h-4" />} label="Available" />
        <Legend icon={<User className="text-yellow-400 w-4 h-4" />} label="Selected" />
        <Legend icon={<XCircle className="text-gray-400 w-4 h-4" />} label="Booked" />
      </div>

      {/* Seat Map */}
      <div className="flex flex-col items-center">{seatMap}</div>

      {/* Instruction */}
      {onSeatClick && (
        <p className="text-center text-gray-500 text-xs mt-2 italic">
          Tap a seat to select. Booked seats are disabled.
        </p>
      )}
    </div>
  );
};

const Legend = ({ icon, label }) => (
  <div className="flex items-center gap-1">
    {icon}
    <span className="text-gray-700">{label}</span>
  </div>
);

export default SeatMap;
