import React, { useState } from "react";
import { X, PlaneTakeoff, CalendarDays } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import LocationPicker from "./LocationPicker";
import rawLocations from "../data/Locations";

const getCityLabel = (code) => {
  const city = rawLocations
    .flatMap((region) => region.countries)
    .flatMap((country) => country.cities)
    .find((c) => c.code === code);
  return city ? `${city.name} (${city.code})` : code;
};

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
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASEURL}/flights`, formData, {
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl animate-fade-in-up p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-violet-700">Add Flight</h2>
          <button onClick={onClose} disabled={loading}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Location Picker */}
        {showLocationPicker && (
          <div className="absolute top-24 left-6 right-6 z-50">
            <LocationPicker
              selectedFrom={formData.from ? { code: formData.from } : null}
              selectedTo={formData.to ? { code: formData.to } : null}
              onSelectFrom={(city) => setFormData((prev) => ({ ...prev, from: city.code }))}
              onSelectTo={(city) => setFormData((prev) => ({ ...prev, to: city.code }))}
              onClose={() => setShowLocationPicker(false)}
            />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Airline", name: "airline" },
            { label: "Flight Number", name: "flightNumber" },
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
                className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
              <PlaneTakeoff size={16} className="text-violet-500" /> From / To
            </label>
            <button
              type="button"
              onClick={() => setShowLocationPicker(true)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-gray-800 shadow-inner text-left relative"
            >
              <div className="flex justify-between text-sm">
                {formData.from ? (
                  <span className="text-violet-600 font-semibold">Origin: {getCityLabel(formData.from)}</span>
                ) : (
                  <span className="text-gray-400">Select Origin</span>
                )}
                {formData.to ? (
                  <span className="text-indigo-600 font-semibold">Destination: {getCityLabel(formData.to)}</span>
                ) : (
                  <span className="text-gray-400">Select Destination</span>
                )}
              </div>
            </button>
          </div>

          <div>
            <label className="text-sm text-gray-600">Departure Time</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              disabled={loading}
              className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
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
              className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="On Time">On Time</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading
                  ? "bg-violet-400"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              } text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300`}
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
