import { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Search, PlaneTakeoff, PlaneLanding, CalendarDays, Repeat } from "lucide-react";
import CustomDateInput from "./CustomDateInput";
import rawLocations from "../data/Locations";

// Convert country names to ISO Alpha-2 codes for flags
const countryToFlagCode = {
  Philippines: "ph",
  Japan: "jp",
  "South Korea": "kr",
  Singapore: "sg",
  Thailand: "th",
  "United Kingdom": "gb",
  Germany: "de",
  "United States": "us",
  Canada: "ca",
};

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "3.2rem",
    borderRadius: "0.75rem",
    border: state.isFocused ? "2px solid #8b5cf6" : "1px solid #d1d5db", // violet-500 or gray-300
    boxShadow: state.isFocused ? "0 0 0 1px #8b5cf6" : "none",
    padding: "0 0.25rem",
    backgroundColor: "#fff",
    transition: "border-color 0.2s, box-shadow 0.2s",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "0 0.5rem",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  singleValue: (base) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 20,
  }),
};

// Flatten locations into react-select format
const formattedLocations = rawLocations.flatMap((region) =>
  region.countries.map((country) => ({
    label: `${country.country}`,
    options: country.cities.map((city) => ({
      value: `${city.name} (${city.code})`,
      label: city.name,
      code: city.code,
      country: country.country,
      flag: `https://flagcdn.com/24x18/${countryToFlagCode[country.country]}.png`,
    })),
  }))
);

const customSingleValue = ({ data }) => (
  <div className="flex items-center gap-2">
    <img src={data.flag} alt={data.country} className="w-5 h-4 rounded-sm" />
    <span>{`${data.label} (${data.code})`}</span>
  </div>
);

const customOption = (props) => {
  const { data, innerRef, innerProps } = props;
  return (
    <div
      ref={innerRef}
      {...innerProps}
      className="px-3 py-2 hover:bg-violet-100 cursor-pointer flex items-center gap-2"
    >
      <img src={data.flag} alt={data.country} className="w-5 h-4 rounded-sm" />
      <span>{`${data.label} (${data.code})`}</span>
    </div>
  );
};

const FlightSearchForm = ({ form, handleChange, handleSearch }) => {
  const [fromMenuOpen, setFromMenuOpen] = useState(false);
  const [toMenuOpen, setToMenuOpen] = useState(false);
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

  // Filter function to exclude selecting same airport for both
  const filterDestinations = (selectedCode) =>
    formattedLocations.map((group) => ({
      ...group,
      options: group.options.filter((option) => option.code !== selectedCode),
    }));

  const findOption = (value) => {
    for (let group of formattedLocations) {
      const match = group.options.find((opt) => opt.value === value);
      if (match) return match;
    }
    return null;
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
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-12 gap-4 items-end">
            {/* From + To */}
            <div className="col-span-12 md:col-span-5 relative">
              <div className="flex gap-2">
                {/* From */}
                <div className="w-1/2">
                  <label className="flex items-center text-sm font-medium text-gray-700 gap-1 mb-1">
                    <PlaneTakeoff size={16} className="text-violet-500" />
                    From
                  </label>
                  <Select
                    name="from"
                    value={findOption(form.from)}
                    onChange={(selected) => handleChange({ target: { name: "from", value: selected?.value || "" } })}
                    options={filterDestinations(form.to)}
                    components={{ SingleValue: customSingleValue, Option: customOption }}
                    menuIsOpen={fromMenuOpen}
                    onMenuOpen={() => setFromMenuOpen(true)}
                    onMenuClose={() => setFromMenuOpen(false)}
                    isSearchable={fromMenuOpen}
                    placeholder="Select origin"
                    styles={customSelectStyles}
                  />
                </div>

                {/* To */}
                <div className="w-1/2">
                  <label className="flex items-center text-sm font-medium text-gray-700 gap-1 mb-1">
                    <PlaneLanding size={16} className="text-violet-500" />
                    To
                  </label>
                  <Select
                    name="to"
                    value={findOption(form.to)}
                    onChange={(selected) => handleChange({ target: { name: "to", value: selected?.value || "" } })}
                    options={filterDestinations(form.from)}
                    components={{ SingleValue: customSingleValue, Option: customOption }}
                    menuIsOpen={toMenuOpen}
                    onMenuOpen={() => setToMenuOpen(true)}
                    onMenuClose={() => setToMenuOpen(false)}
                    isSearchable={toMenuOpen}
                    placeholder="Select destination"
                    styles={customSelectStyles}
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
