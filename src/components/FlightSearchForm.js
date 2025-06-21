import { Search, PlaneTakeoff, PlaneLanding, CalendarDays, Repeat } from "lucide-react";
import DatePicker from "react-datepicker";
import CustomDateInput from "./CustomDateInput";

const FlightSearchForm = ({ form, handleChange, handleSearch }) => {
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
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-12 gap-4 items-end">
            {/* From + To with Reverse */}
            <div className="col-span-12 md:col-span-5 relative">
              <div className="flex gap-2">
                <div className="w-1/2">
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

                <div className="w-1/2">
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
              </div>

              {/* Reverse Button */}
              <button
                type="button"
                onClick={reverseFromTo}
                className="absolute left-1/2 top-2/3 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-violet-200 hover:bg-violet-100 p-2 rounded-full z-10 shadow-md transition duration-300"
                title="Reverse Route"
              >
                <Repeat size={20} className="text-violet-700" />
              </button>
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
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FlightSearchForm;
