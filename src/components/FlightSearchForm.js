import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Search, PlaneTakeoff, CalendarDays, Repeat } from "lucide-react";
import CustomDateInput from "./CustomDateInput";
import rawLocations from "../data/Locations";
import LocationPicker from "./LocationPicker";

const getCityLabel = (code) => {
  const city = rawLocations
    .flatMap((region) => region.countries)
    .flatMap((country) => country.cities)
    .find((c) => c.code === code);
  return city ? `${city.name} (${city.code})` : code;
};

const FlightSearchForm = ({ form, handleChange }) => {
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  const reverseFromTo = () => {
    handleChange({ target: { name: "from", value: form.to } });
    handleChange({ target: { name: "to", value: form.from } });
  };

  const handleDateRangeChange = (dates) => {
    if (form.tripType === "round-trip") {
      const [start, end] = Array.isArray(dates) ? dates : [null, null];
      handleChange({ target: { name: "departure", value: start } });
      handleChange({ target: { name: "return", value: end } });
    } else {
      const date = dates instanceof Date ? dates : null;
      handleChange({ target: { name: "departure", value: date } });
      handleChange({ target: { name: "return", value: null } });
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString(undefined, {
          weekday: "short",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "";

  const formattedDateDisplay =
    form.tripType === "round-trip"
      ? `${formatDate(form.departure)} - ${formatDate(form.return)}`
      : `${formatDate(form.departure)}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams({
      from: form.from,
      to: form.to,
      departure: form.departure?.toISOString(),
      returnDate: form.tripType === "round-trip" && form.return ? form.return.toISOString() : "",
      tripType: form.tripType,
    });
    navigate(`/flight-results?${queryParams.toString()}`);
  };

  return (
    <section className="relative z-30 px-4 sm:px-8 md:px-16 max-w-screen-xl mx-auto -mt-24" id="searchFlight">
      <div className="group relative bg-white/70 backdrop-blur-2xl border border-violet-200 rounded-3xl shadow-[0_15px_50px_rgba(88,28,135,0.3)] transition-all duration-500 ease-in-out hover:shadow-[0_20px_80px_rgba(88,28,135,0.5)] hover:scale-[1.01] p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Trip Type Toggle */}
        <div className="flex items-center justify-center gap-10">
          {["one-way", "round-trip"].map((type) => (
            <label
              key={type}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer"
            >
              <input
                type="radio"
                name="tripType"
                value={type}
                checked={form.tripType === type}
                onChange={handleChange}
                className="form-radio text-violet-600 focus:ring-violet-500"
              />
              <span className="capitalize">{type.replace("-", " ")}</span>
            </label>
          ))}
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 gap-4 items-end">
            {/* From + To Field */}
            <div className="col-span-12 md:col-span-5 relative" ref={popoverRef}>
              <label className="flex items-center text-sm font-medium text-gray-700 gap-1 mb-1">
                <PlaneTakeoff size={16} className="text-violet-500" />
                From / To
              </label>
              <button
                type="button"
                onClick={() => setPopoverOpen(!popoverOpen)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner text-left relative flex items-center justify-between gap-4"
              >
                {/* Text Content */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm flex-1">
                  {form.from ? (
                    <span className="text-gray-700">
                      <span className="text-violet-600 font-semibold">Origin:</span> {getCityLabel(form.from)}
                    </span>
                  ) : (
                    <span className="text-gray-400">Select Origin</span>
                  )}
                  {form.to ? (
                    <span className="text-gray-700 mt-1 sm:mt-0 sm:ml-4">
                      <span className="text-indigo-600 font-semibold">Destination:</span> {getCityLabel(form.to)}
                    </span>
                  ) : (
                    <span className="text-gray-400 mt-1 sm:mt-0 sm:ml-4">Select Destination</span>
                  )}
                </div>

                {/* Reverse Button Inside */}
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

              {/* Location Picker */}
              {popoverOpen && (
                <div className="absolute mt-2 left-0 w-full max-w-3xl z-50">
                  <LocationPicker
                    form={form}
                    selectedFrom={form.from ? { code: form.from } : null}
                    selectedTo={form.to ? { code: form.to } : null}
                    onSelectFrom={(city) => {
                      handleChange({ target: { name: "from", value: city.code } });
                      if (form.to) setPopoverOpen(false);
                    }}
                    onSelectTo={(city) => {
                      handleChange({ target: { name: "to", value: city.code } });
                      if (form.from) setPopoverOpen(false);
                    }}
                    onClose={() => setPopoverOpen(false)}
                  />
                </div>
              )}
            </div>

            {/* Date Picker */}
            <div className="col-span-12 md:col-span-4">
              <label className="flex items-center text-sm font-medium text-gray-700 gap-1 mb-1">
                <CalendarDays size={16} className="text-violet-500" />
                {form.tripType === "round-trip" ? "Dates" : "Departure"}
              </label>
              <DatePicker
                {...(form.tripType === "round-trip"
                  ? {
                      selectsRange: true,
                      startDate: form.departure ? new Date(form.departure) : null,
                      endDate: form.return ? new Date(form.return) : null,
                    }
                  : {
                      selected: form.departure ? new Date(form.departure) : null,
                    })}
                onChange={handleDateRangeChange}
                minDate={new Date()}
                customInput={<CustomDateInput placeholder="Select travel dates" value={formattedDateDisplay} />}
                dateFormat="eee, MMMM d, yyyy"
                wrapperClassName="w-full"
              />
            </div>

            {/* Search Button */}
            <div className="col-span-12 md:col-span-3">
              <button
                type="submit"
                className="w-full h-[3.2rem] bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search Flights
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FlightSearchForm;
