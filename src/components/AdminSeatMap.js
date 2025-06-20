import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { User, CheckCircle, XCircle } from "lucide-react";

const AdminSeatMap = ({ seats, onToggleSeat }) => {
  if (!seats || seats.length === 0) {
    return <p className="text-center text-gray-400 text-lg font-medium mt-10">No seats available.</p>;
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

      console.log(`Seat ${seat.seatNumber} - isBooked: ${isBooked}`);
      console.log("Passenger ID:", seat.passengerId);
      console.log("Passenger Name:", seat.passengerId?.fullName);

      let baseStyle = "bg-violet-500 text-white";
      if (isBooked) baseStyle = "bg-red-400 text-white cursor-not-allowed";
      else baseStyle = "bg-violet-500 text-white hover:bg-violet-600";

      const seatClasses = `
        w-12 h-12 sm:w-14 sm:h-14
        rounded-xl flex items-center justify-center 
        font-semibold text-sm sm:text-base
        shadow-md transition-all duration-300
        ${isBooked ? "opacity-70" : "hover:scale-105 cursor-pointer"}
        ${baseStyle}
      `;

      const tooltipText = isBooked
        ? seat.passengerId?.fullName
          ? `Booked by ${seat.passengerId.fullName}`
          : "Seat is booked"
        : "Click to toggle availability";

      rowSeats.push(
        <Tippy
          key={`tip-${seat._id}`}
          content={
            <div className="bg-neutral-800 text-white text-xs px-3 py-2 rounded shadow-lg max-w-[200px]">
              {tooltipText}
            </div>
          }
        >
          <button
            key={seat._id}
            onClick={() => onToggleSeat(seat._id)}
            aria-label={`Seat ${seat.seatNumber}`}
            className={seatClasses}
          >
            {seat.seatNumber}
          </button>
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
    <div className="w-full max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold text-center text-violet-700 mb-6">Admin Seat Control</h2>

      <div className="flex justify-center gap-6 sm:gap-10 mb-6 text-sm sm:text-base font-medium">
        <Legend icon={<CheckCircle className="text-violet-500 w-5 h-5" />} label="Available" />
        <Legend icon={<XCircle className="text-red-400 w-5 h-5" />} label="Booked" />
      </div>

      <div className="flex flex-col items-center">{seatMap}</div>

      <p className="text-center text-gray-500 text-xs sm:text-sm mt-6 italic">
        Hover to view booking details. Click available seats to toggle status.
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

export default AdminSeatMap;
