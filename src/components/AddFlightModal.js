import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const AddFlightModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    airline: "",
    flightNumber: "",
    from: "",
    to: "",
    gate: "",
    terminal: "",
    price: "",
    seatCapacity: "",
    departureTime: "",
    arrivalTime: "",
    status: "On Time",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/flights", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("✈️ Flight added successfully!");
      onSubmit(res.data);
      onClose();
    } catch (error) {
      console.error("Add flight error:", error);
      toast.error("❌ Failed to add flight. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-violet-700">Add Flight</h2>
          <button onClick={onClose} disabled={loading}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          {[
            { label: "Airline", name: "airline" },
            { label: "Flight Number", name: "flightNumber" },
            { label: "From", name: "from" },
            { label: "To", name: "to" },
            { label: "Gate", name: "gate" },
            { label: "Terminal", name: "terminal" },
            { label: "Price (₱)", name: "price", type: "number" },
            { label: "Seat Capacity", name: "seatCapacity", type: "number" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="text-sm text-gray-600">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                disabled={loading}
                className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          ))}

          <div>
            <label className="text-sm text-gray-600">Departure Time</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              disabled={loading}
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Arrival Time</label>
            <input
              type="datetime-local"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              disabled={loading}
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="On Time">On Time</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Submit */}
          <div className="col-span-full flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-violet-400" : "bg-violet-600 hover:bg-violet-700"
              } text-white px-6 py-2 rounded-lg shadow`}
            >
              {loading ? "Saving..." : "Add Flight"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlightModal;
