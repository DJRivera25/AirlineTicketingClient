import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ETicket from "../components/ETicket.js";
import html2pdf from "html2pdf.js";
import { Loader2, Download, Home, HelpCircle, UserCheck2, PlaneTakeoff, PlaneLanding } from "lucide-react";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBooking(res.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleDownload = () => {
    const ticketElement = ticketRef.current;
    if (!ticketElement) {
      alert("Ticket not found.");
      return;
    }

    // Optional delay to ensure the hidden element is rendered
    setTimeout(() => {
      html2pdf()
        .set({
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: `TiketLakwatsero_Eticket_${booking._id}.pdf`,
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(ticketElement)
        .save();
    }, 1000); // Delay in milliseconds
  };
  const ticketRef = useRef();
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <Loader2 className="animate-spin h-8 w-8 mr-2" />
        Loading booking confirmation...
      </div>
    );
  }

  if (!booking || booking.status !== "paid") {
    return <div className="text-center mt-20 text-red-600 text-lg font-semibold">❌ Booking not found.</div>;
  }

  const {
    _id,
    passengers,
    departureFlight,
    returnFlight,
    tripType,
    totalPrice,
    paymentStatus,
    bookedAt,
    fullName,
    email,
    phone,
  } = booking;

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8 text-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-violet-700 mb-2">✅ Booking Confirmed!</h1>
          <p className="text-gray-500">
            Reference No: <span className="font-medium">{_id}</span>
          </p>
          <p className="text-sm text-gray-400">Booked at: {new Date(bookedAt).toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-semibold">Trip Type:</span>{" "}
            {tripType === "roundtrip" ? "Roundtrip ✈️⏪✈️" : "One-way ✈️"}
          </p>
        </div>

        {/* Payment & E-ticket */}
        <div className="bg-white p-6 rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <p className="text-lg font-semibold">Total Paid:</p>
            <p className="text-3xl text-green-600 font-bold">₱{totalPrice.toLocaleString()}</p>
          </div>
          <button
            onClick={handleDownload}
            className="mt-4 sm:mt-0 flex items-center bg-violet-500 text-white px-5 py-2.5 rounded hover:bg-violet-700 transition"
          >
            <Download className="w-5 h-5 mr-2" />
            Download E-ticket
          </button>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold text-violet-700 mb-2">📞 Contact Information</h2>
          <p>
            <strong>Name:</strong> {fullName}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Phone:</strong> {phone}
          </p>
        </div>

        {/* Flight Details: Side-by-side */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6 text-violet-700">✈️ Flight Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departureFlight && (
              <div className="border rounded p-4 bg-gray-50">
                <h3 className="text-lg font-semibold flex items-center text-violet-600 mb-2">
                  <PlaneTakeoff className="w-5 h-5 mr-2" />
                  Departure Flight
                </h3>
                <p>
                  <strong>Airline:</strong> {departureFlight.airline}
                </p>
                <p>
                  <strong>Flight No:</strong> {departureFlight.flightNumber}
                </p>
                <p>
                  <strong>From:</strong> {departureFlight.from}
                </p>
                <p>
                  <strong>To:</strong> {departureFlight.to}
                </p>
                <p>
                  <strong>Departure:</strong> {new Date(departureFlight.departureTime).toLocaleString()}
                </p>
                <p>
                  <strong>Arrival:</strong> {new Date(departureFlight.arrivalTime).toLocaleString()}
                </p>
              </div>
            )}

            {tripType === "roundtrip" && returnFlight && (
              <div className="border rounded p-4 bg-gray-50">
                <h3 className="text-lg font-semibold flex items-center text-violet-600 mb-2">
                  <PlaneLanding className="w-5 h-5 mr-2" />
                  Return Flight
                </h3>
                <p>
                  <strong>Airline:</strong> {returnFlight.airline}
                </p>
                <p>
                  <strong>Flight No:</strong> {returnFlight.flightNumber}
                </p>
                <p>
                  <strong>From:</strong> {returnFlight.from}
                </p>
                <p>
                  <strong>To:</strong> {returnFlight.to}
                </p>
                <p>
                  <strong>Departure:</strong> {new Date(returnFlight.departureTime).toLocaleString()}
                </p>
                <p>
                  <strong>Arrival:</strong> {new Date(returnFlight.arrivalTime).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Passenger Info */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold text-violet-700 mb-4">👥 Passenger Information</h2>
          {passengers.map((passenger, idx) => (
            <div key={idx} className="mb-4 border-b pb-4">
              <p>
                <strong>Full Name:</strong> {passenger.fullName}
              </p>
              <p>
                <strong>Birthdate:</strong> {new Date(passenger.birthdate).toLocaleDateString()}
              </p>
              <p>
                <strong>Passport No:</strong> {passenger.passportNumber}
              </p>
              <p>
                <strong>Seat (Outbound):</strong> {passenger.outboundSeatNumber || "Auto Assigned"}
              </p>
              {tripType === "roundtrip" && (
                <p>
                  <strong>Seat (Return):</strong> {passenger.returnSeatNumber || "Auto Assigned"}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <button
            onClick={() => navigate("/account/bookings")}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
          >
            <UserCheck2 className="inline-block w-4 h-4 mr-2" />
            My Bookings
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            <Home className="inline-block w-4 h-4 mr-2" />
            Back to Homepage
          </button>
          <button
            onClick={() => navigate("/support")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <HelpCircle className="inline-block w-4 h-4 mr-2" />
            Support
          </button>
        </div>

        {/* Footer */}
        <div className="bg-green-100 text-green-800 p-4 rounded mt-6">
          📧 A confirmation email and SMS with your e-ticket have been sent.
        </div>
      </div>
      {/* ETicket Download */}
      {booking && (
        <div style={{ display: "none" }}>
          <div ref={ticketRef}>
            <ETicket booking={booking} />
          </div>
        </div>
      )}
    </>
  );
};

export default BookingConfirmation;
