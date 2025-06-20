import React, { useState, useEffect, useContext } from "react";
import FlightsContext from "../context/FlightsContext";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import AddFlightModal from "../components/AddFlightModal";

const ManageFlights = () => {
  const { fetchFlights, deleteFlight } = useContext(FlightsContext);
  const navigate = useNavigate();

  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadFlights = async () => {
    try {
      const data = await fetchFlights(page, 10, search);
      setFlights(data.flights || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching flights:", error);
      setFlights([]);
    }
  };

  useEffect(() => {
    loadFlights();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flight?")) return;
    try {
      await deleteFlight(id);
      loadFlights();
    } catch (error) {
      alert("Error deleting flight: " + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-violet-700">Flight Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded"
        >
          <FiPlus /> Add Flight
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by airline, route, flight number..."
        className="border px-4 py-2 rounded mb-4 w-full sm:w-1/2"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <div className="bg-white p-4 shadow rounded overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Flight No</th>
              <th className="p-2 border">From</th>
              <th className="p-2 border">To</th>
              <th className="p-2 border">Departure</th>
              <th className="p-2 border">Arrival</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights?.length > 0 ? (
              flights.map((f) => (
                <tr
                  key={f._id}
                  onClick={() => navigate(`/admin/flights/${f._id}`)}
                  className="text-center cursor-pointer hover:bg-gray-100 transition"
                >
                  <td className="p-2 border">{f.flightNumber}</td>
                  <td className="p-2 border">{f.from}</td>
                  <td className="p-2 border">{f.to}</td>
                  <td className="p-2 border">{new Date(f.departureTime).toLocaleString()}</td>
                  <td className="p-2 border">{new Date(f.arrivalTime).toLocaleString()}</td>
                  <td className="p-2 border">₱{f.price}</td>
                  <td className="p-2 border">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(f._id);
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No flights available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <AddFlightModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(newFlight) => {
          setFlights((prev) => [...prev, newFlight]);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default ManageFlights;
