import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { User, CheckCircle, XCircle } from "lucide-react";

const SeatMap = ({ seats, onSeatClick, selectedSeatNumbers = [] }) => {
  if (!seats || seats.length === 0) {
    return <p className="text-center text-gray-400 text-lg font-medium mt-10">No seats available for this flight.</p>;
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

      // 🎨 Color scheme adjustments
      let baseColor = "bg-violet-500 text-white";
      if (isBooked) baseColor = "bg-gray-300 text-gray-700 cursor-not-allowed";
      else if (isSelected) baseColor = "bg-yellow-500 text-white border-2 border-white shadow-xl";

      const seatClasses = `
        w-12 h-12 sm:w-14 sm:h-14
        rounded-xl flex items-center justify-center 
        font-bold text-sm sm:text-base
        transition-all duration-300
        ${!isBooked ? "hover:scale-105 cursor-pointer" : "opacity-80"}
        ${baseColor}
        shadow-md
      `;

      const tooltipText = isBooked
        ? seat.passengerId?.fullName
          ? `Seat is currently booked`
          : "Seat is currently booked"
        : isSelected
        ? "Selected seat"
        : "Available seat";

      const seatButton = (
        <button
          key={seat._id}
          disabled={isBooked}
          onClick={() => !isBooked && onSeatClick(seat.seatNumber)}
          className={seatClasses}
          aria-label={`Seat ${seat.seatNumber}`}
        >
          {seat.seatNumber}
        </button>
      );

      rowSeats.push(
        <Tippy
          key={`tip-${seat._id}`}
          content={
            <div className="bg-neutral-900 text-white text-sm font-medium px-3 py-2 rounded-lg shadow-xl backdrop-blur-md">
              {tooltipText}
            </div>
          }
          animation="shift-away"
          delay={[200, 0]}
        >
          <div>{seatButton}</div>
        </Tippy>
      );

      // Aisle gap
      if (col === 2) {
        rowSeats.push(<div key={`aisle-${row}`} className="w-4 sm:w-6 h-6 border-l border-gray-300 opacity-50" />);
      }
    }

    seatMap.push(
      <div key={`row-${row}`} className="flex gap-2 sm:gap-4 justify-center items-center mb-3">
        {rowSeats}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 px-4">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-violet-700 mb-6 tracking-tight">
        Select Your Seat
      </h2>

      {/* Legend */}
      <div className="flex justify-center gap-6 sm:gap-10 mb-6 text-sm sm:text-base font-medium">
        <Legend icon={<CheckCircle className="text-violet-500 w-5 h-5" />} label="Available" />
        <Legend icon={<User className="text-yellow-500 w-5 h-5" />} label="Selected" />
        <Legend icon={<XCircle className="text-gray-400 w-5 h-5" />} label="Booked" />
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col items-center">{seatMap}</div>

      {/* Instruction */}
      <p className="text-center text-gray-600 text-sm sm:text-base mt-6 italic">
        Tap on an available seat to select. Booked seats are disabled.
      </p>
    </div>
  );
};

const Legend = ({ icon, label }) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className="text-gray-700 dark:text-white">{label}</span>
  </div>
);

export default SeatMap;
