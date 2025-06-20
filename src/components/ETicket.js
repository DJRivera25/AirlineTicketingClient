import React from "react";
import "tailwindcss/tailwind.css";
import ticketBg from "../assets/ticket-bg.png";

const ETicket = ({ booking }) => {
  const { passengers, departureFlight, returnFlight, tripType, bookedAt, _id } = booking;

  const renderBoardingPass = (passenger, type, flight, seatNumber, index) => (
    <div
      key={`${passenger.fullName}-${type}`}
      className="relative w-[21cm] h-[9.5cm] max-w-full mb-6 overflow-hidden rounded-2xl shadow-2xl border border-gray-300 print:break-inside-avoid bg-center bg-cover"
      style={{
        backgroundImage: `url(${ticketBg})`,
      }}
    >
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-md"></div>

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full grid grid-cols-12 p-6 font-sans text-gray-800">
        {/* Left Section */}
        <div className="col-span-9 pr-6 border-r border-dashed border-gray-400">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-300 pb-3">
            <div>
              <h2 className="text-2xl font-bold text-violet-700 tracking-widest uppercase">✈ Tiket Lakwatsero</h2>
              <p className="text-sm italic text-gray-600 mt-1">Boarding Pass</p>
            </div>
            <div className="text-right text-sm space-y-1">
              <div>
                <p className="text-gray-500">Ref:</p>
                <p className="font-bold tracking-wide text-lg">{_id.slice(-6).toUpperCase()}</p>
              </div>
              <p className="italic text-gray-500 text-xs">{new Date(bookedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Passenger & Flight Details */}
          <div className="grid grid-cols-2 gap-8 mt-4 text-[14px] leading-snug">
            {/* Passenger Info */}
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-gray-500">Passenger:</span> {passenger.fullName}
              </div>
              <div>
                <span className="font-semibold text-gray-500">Passport #:</span> {passenger.passportNumber}
              </div>
              <div>
                <span className="font-semibold text-gray-500">Birthdate:</span>{" "}
                {new Date(passenger.birthdate).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold text-gray-500">Trip Type:</span> {type}
              </div>
              <div>
                <span className="font-semibold text-gray-500">Seat:</span>{" "}
                <span className="font-bold text-gray-800">{seatNumber || "Auto Assigned"}</span>
              </div>
            </div>

            {/* Flight Info */}
            <div className="space-y-2">
              <div>
                <span className="font-semibold text-gray-500">Flight:</span> {flight.airline} {flight.flightNumber}
              </div>
              <div>
                <span className="font-semibold text-gray-500">From:</span>{" "}
                <span className="uppercase">{flight.from}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-500">To:</span> <span className="uppercase">{flight.to}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-500">Departure:</span>{" "}
                {new Date(flight.departureTime).toLocaleString()}
              </div>
              <div>
                <span className="font-semibold text-gray-500">Arrival:</span>{" "}
                {new Date(flight.arrivalTime).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Gate & Terminal */}
          <div className="grid grid-cols-3 gap-4 mt-6 text-center text-[13px]">
            <div>
              <p className="text-gray-500 font-medium">Terminal</p>
              <p className="text-lg font-bold">{flight.terminal || "TBD"}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Gate</p>
              <p className="text-lg font-bold">{flight.gate || "TBD"}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">Boarding Time</p>
              <p className="text-lg font-bold">
                {new Date(new Date(flight.departureTime).getTime() - 45 * 60000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section (QR and Summary) */}
        <div className="col-span-3 pl-6 flex flex-col justify-between items-center text-center">
          {/* From - To */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 tracking-wider">
              {flight.from.toUpperCase()} → {flight.to.toUpperCase()}
            </h3>
            <p className="text-sm italic text-gray-500">{type}</p>
          </div>

          {/* QR Placeholder */}
          <div className="w-24 h-24 bg-white/70 border border-gray-300 rounded-md flex items-center justify-center text-[11px] text-gray-400 mt-6">
            QR CODE
          </div>

          {/* Perforation Line */}
          <div className="w-full border-t border-dashed border-gray-400 mt-6 text-center text-[11px] text-gray-400">
            Tear Along Line
          </div>
        </div>
      </div>
    </div>
  );

  const allTickets = passengers.flatMap((passenger) => [
    renderBoardingPass(
      passenger,
      "Departure",
      departureFlight,
      passenger.outboundSeatNumber,
      passengers.indexOf(passenger) * 2
    ),
    tripType === "roundtrip"
      ? renderBoardingPass(
          passenger,
          "Return",
          returnFlight,
          passenger.returnSeatNumber,
          passengers.indexOf(passenger) * 2 + 1
        )
      : null,
  ]);

  return <div className="p-6 bg-gradient-to-br from-gray-100 via-white to-gray-50 print:bg-white">{allTickets}</div>;
};

export default ETicket;
