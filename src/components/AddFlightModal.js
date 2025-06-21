import React, { useState } from "react";
import {
  X,
  PlaneTakeoff,
  CalendarDays,
  Repeat,
  Plane,
  Hash,
  DoorOpen,
  Landmark,
  DollarSign,
  Users,
  Info,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    departureTime: null,
    arrivalTime: null,
    status: "On Time",
  });

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const reverseFromTo = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        from: getCityLabel(formData.from),
        to: getCityLabel(formData.to),
        departureTime: formData.departureTime?.toISOString(),
        arrivalTime: formData.arrivalTime?.toISOString(),
      };

      const res = await axios.post(`${process.env.REACT_APP_API_BASEURL}/flights`, payload, {
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

  const inputFields = [
    { label: "Airline", name: "airline", icon: <Plane size={16} className="text-violet-500" /> },
    { label: "Flight Number", name: "flightNumber", icon: <Hash size={16} className="text-violet-500" /> },
    { label: "Gate", name: "gate", icon: <DoorOpen size={16} className="text-violet-500" /> },
    { label: "Terminal", name: "terminal", icon: <Landmark size={16} className="text-violet-500" /> },
    { label: "Price (₱)", name: "price", icon: <DollarSign size={16} className="text-violet-500" />, type: "number" },
    {
      label: "Seat Capacity",
      name: "seatCapacity",
      icon: <Users size={16} className="text-violet-500" />,
      type: "number",
    },
  ];

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
          {inputFields.map(({ label, name, type = "text", icon }) => (
            <div key={name}>
              <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                {icon}
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          ))}

          {/* From / To */}
          <div className="sm:col-span-2">
            <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
              <PlaneTakeoff size={16} className="text-violet-500" /> From / To
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowLocationPicker(true)}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 shadow-inner text-left"
              >
                <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-700">
                  <span className="text-violet-600 font-medium">
                    {formData.from ? `Origin: ${getCityLabel(formData.from)}` : "Select Origin"}
                  </span>
                  <span className="text-indigo-600 font-medium sm:ml-4 mt-1 sm:mt-0">
                    {formData.to ? `Destination: ${getCityLabel(formData.to)}` : "Select Destination"}
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={reverseFromTo}
                className="p-2 bg-white border border-violet-300 hover:bg-violet-100 rounded-full"
                title="Reverse Route"
              >
                <Repeat size={18} className="text-violet-600" />
              </button>
            </div>
          </div>

          {/* Departure */}
          <div>
            <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
              <CalendarDays size={16} className="text-violet-500" /> Departure Time
            </label>
            <DatePicker
              selected={formData.departureTime}
              onChange={(date) => handleDateChange("departureTime", date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholderText="Select Departure"
            />
          </div>

          {/* Arrival */}
          <div>
            <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
              <CalendarDays size={16} className="text-violet-500" /> Arrival Time
            </label>
            <DatePicker
              selected={formData.arrivalTime}
              onChange={(date) => handleDateChange("arrivalTime", date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={formData.departureTime || new Date()}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholderText="Select Arrival"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm text-gray-600 flex items-center gap-1 mb-1">
              <Info size={16} className="text-violet-500" /> Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="On Time">On Time</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Submit */}
          <div className="sm:col-span-2 flex justify-end pt-4">
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
