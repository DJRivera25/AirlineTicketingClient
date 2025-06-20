import { useState } from "react";
import { Search, CalendarDays, PlaneTakeoff, PlaneLanding, Briefcase, RefreshCcw } from "lucide-react";

const FlightSearchForm = ({ form, handleChange, handleSearch }) => {
  const [tripType, setTripType] = useState("round-trip");

  return (
    <section
      className="relative z-10 px-4 sm:px-8 md:px-16 max-w-screen-xl mx-auto -mt-20 animate-fadeInUp"
      id="searchFlight"
    >
      {/* Animated background blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-violet-800 to-violet-700 opacity-10 animate-pulse-slow" />

      <div className="relative bg-white/80 backdrop-blur-2xl border border-violet-100 rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-14 space-y-10 transition-all duration-300 hover:shadow-violet-400/30">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-violet-800 tracking-tight">Book Your Flight</h2>
          <p className="text-gray-600 text-lg sm:text-xl">
            Plan smarter. Fly better. Wherever you're headed, we’ve got you covered.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSearch} className="space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Trip Type */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 gap-1 mb-1">
                <RefreshCcw size={16} className="text-violet-500" />
                Trip Type
              </label>
              <select
                name="tripType"
                value={tripType}
                onChange={(e) => {
                  setTripType(e.target.value);
                  handleChange(e);
                }}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner"
              >
                <option value="one-way">One Way</option>
                <option value="round-trip">Round Trip</option>
              </select>
            </div>

            {/* Departure Date */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 gap-1 mb-1">
                <CalendarDays size={16} className="text-violet-500" />
                Departure Date
              </label>
              <input
                name="departure"
                value={form.departure}
                onChange={handleChange}
                type="date"
                required
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner"
              />
            </div>

            {/* Return Date (only for round trip) */}
            {tripType === "round-trip" && (
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 gap-1 mb-1">
                  <CalendarDays size={16} className="text-violet-500" />
                  Return Date
                </label>
                <input
                  name="return"
                  value={form.return}
                  onChange={handleChange}
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner"
                />
              </div>
            )}
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* From */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 gap-1 mb-1">
                <PlaneTakeoff size={16} className="text-violet-500" />
                From
              </label>
              <input
                name="from"
                value={form.from}
                onChange={handleChange}
                type="text"
                placeholder="e.g., Manila (MNL)"
                required
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner"
              />
            </div>

            {/* To */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 gap-1 mb-1">
                <PlaneLanding size={16} className="text-violet-500" />
                To
              </label>
              <input
                name="to"
                value={form.to}
                onChange={handleChange}
                type="text"
                placeholder="e.g., Tokyo (NRT)"
                required
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner"
              />
            </div>

            {/* Class */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 gap-1 mb-1">
                <Briefcase size={16} className="text-violet-500" />
                Cabin Class
              </label>
              <select
                name="class"
                value={form.class}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner"
              >
                <option value="Economy">Economy</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Business">Business</option>
                <option value="First">First Class</option>
              </select>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-violet-700 hover:bg-violet-800 text-white text-lg font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-violet-400/40 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search Flights
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FlightSearchForm;
