import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import EditFlightModal from "../components/EditFlightModal";
import AdminSeatMap from "../components/AdminSeatMap";

const ManageFlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4000/flights/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFlight(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch flight details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [id]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/seats/flight/${id}`);
        setSeats(res.data);
      } catch (err) {
        console.error("Failed to fetch seats:", err);
      }
    };

    fetchSeats();
  }, [id]);

  const handleSeatClick = async (seatId) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/seats/${seatId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSeats((prev) => prev.map((seat) => (seat._id === seatId ? data : seat)));
    } catch (err) {
      console.error("Failed to toggle seat status:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-violet-600 border-opacity-60"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-center">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
        <button
          onClick={() => navigate("/admin/flights")}
          className="mt-4 bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
        >
          Back to Flights
        </button>
      </div>
    );
  }

  if (!flight) {
    return <div className="p-6 text-center text-gray-500">No flight found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white shadow-xl rounded-xl mt-10">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/admin/flights")}
          className="flex items-center gap-2 text-violet-700 hover:underline hover:text-violet-900"
        >
          <ArrowLeft size={20} />
          Back to Flights
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="mt-6 bg-violet-500 hover:bg-violet-600 text-white px-6 py-2 rounded-lg shadow"
        >
          Edit Flight
        </button>
        <EditFlightModal
          id={id}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          flightData={flight}
          onSave={(updated) => setFlight(updated)}
        />
      </div>

      <h1 className="text-3xl font-bold text-violet-700 mb-6">Flight Details</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-base text-gray-700">
        <div>
          <strong>Airline:</strong>
          <div>{flight.airline}</div>
        </div>
        <div>
          <strong>Status:</strong>
          <div>{flight.status}</div>
        </div>
        <div>
          <strong>Flight Number:</strong>
          <div>{flight.flightNumber}</div>
        </div>
        <div>
          <strong>From:</strong>
          <div>{flight.from}</div>
        </div>
        <div>
          <strong>To:</strong>
          <div>{flight.to}</div>
        </div>
        <div>
          <strong>Departure Time:</strong>
          <div>{new Date(flight.departureTime).toLocaleString()}</div>
        </div>
        <div>
          <strong>Arrival Time:</strong>
          <div>{new Date(flight.arrivalTime).toLocaleString()}</div>
        </div>
        <div>
          <strong>Price:</strong>
          <div>₱{parseFloat(flight.price).toLocaleString()}</div>
        </div>
        <div>
          <strong>Seat Capacity:</strong>
          <div>{flight.seatCapacity}</div>
        </div>
        <div>
          <strong>Available Seats:</strong>
          <div>{flight.availableSeats}</div>
        </div>
        <div>
          <strong>Gate:</strong>
          <div>{flight.gate || "N/A"}</div>
        </div>
        <div>
          <strong>Terminal:</strong>
          <div>{flight.terminal || "N/A"}</div>
        </div>
      </div>

      {/* Seat Map Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-violet-600 mb-2">Seat Configuration</h2>
        <p className="text-sm text-gray-500 mb-2">
          <span className="inline-block w-3 h-3 rounded bg-green-500 mr-2"></span>Available
          <span className="inline-block w-3 h-3 rounded bg-red-500 ml-4 mr-2"></span>Booked
        </p>
        <div className="bg-gray-100 p-4 rounded-md border">
          <AdminSeatMap seats={seats} onToggleSeat={handleSeatClick} />
        </div>
      </div>
    </div>
  );
};

export default ManageFlightDetails;
