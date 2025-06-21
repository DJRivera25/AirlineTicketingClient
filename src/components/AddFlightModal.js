import React, { useState } from "react";
import { X, PlaneTakeoff, Repeat, CalendarDays } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import LocationPicker from "./LocationPicker";
import rawLocations from "../data/Locations";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const getCityLabel = (code) => {
  const city = rawLocations
    .flatMap((region) => region.countries)
    .flatMap((country) => country.cities.map((city) => ({ ...city, country: country.name })))
    .find((c) => c.code === code);
  return city ? `${city.name}, ${city.country} (${city.code})` : code;
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
    departureTime: null,
    arrivalTime: null,
    status: "On Time",
  });

  const [loading, setLoading] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const reverseFromTo = () => {
    setFormData((prev) => ({ ...prev, from: prev.to, to: prev.from }));
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
          {["airline", "flightNumber", "gate", "terminal", "price", "seatCapacity"].map((name) => (
            <div key={name}>
              <label className="text-sm text-gray-600 capitalize">{name.replace(/([A-Z])/g, " $1")}</label>
              <input
                type={name === "price" || name === "seatCapacity" ? "number" : "text"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                disabled={loading}
                className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          ))}

          {/* From / To */}
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
              <PlaneTakeoff size={16} className="text-violet-500" /> From / To
            </label>
            <button
              type="button"
              onClick={() => setShowLocationPicker(true)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-gray-800 shadow-inner text-left relative flex items-center justify-between gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm flex-1">
                {formData.from ? (
                  <span className="text-violet-600 font-semibold">Origin: {getCityLabel(formData.from)}</span>
                ) : (
                  <span className="text-gray-400">Select Origin</span>
                )}
                {formData.to ? (
                  <span className="text-indigo-600 font-semibold sm:ml-4">
                    Destination: {getCityLabel(formData.to)}
                  </span>
                ) : (
                  <span className="text-gray-400 sm:ml-4">Select Destination</span>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  reverseFromTo();
                }}
                className="shrink-0 p-1.5 bg-white border border-violet-200 hover:bg-violet-100 rounded-full shadow-sm transition"
                title="Reverse Route"
              >
                <Repeat size={16} className="text-violet-700" />
              </button>
            </button>
          </div>

          {/* Departure & Arrival Time */}
          {["departureTime", "arrivalTime"].map((name) => (
            <div key={name}>
              <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                <CalendarDays size={16} className="text-violet-500" />
                {name === "departureTime" ? "Departure Time" : "Arrival Time"}
              </label>
              <DatePicker
                selected={formData[name] ? new Date(formData[name]) : null}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, [name]: date ? new Date(date).toISOString() : "" }))
                }
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                placeholderText={`Select ${name === "departureTime" ? "departure" : "arrival"} time`}
                className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          ))}

          {/* Status */}
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full mt-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {["On Time", "Delayed", "Cancelled", "Completed"].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
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
