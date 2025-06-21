import { useState, useRef, useEffect } from "react";
import { PlaneTakeoff, PlaneLanding, X, Search as SearchIcon } from "lucide-react";
import locations from "../data/Locations";

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

const flattenCities = () => {
  return locations.flatMap((region) =>
    region.countries.flatMap((country) =>
      country.cities.map((city) => ({
        city: city.name,
        code: city.code,
        country: country.country,
        flag: `https://flagcdn.com/24x18/${countryToFlagCode[country.country]}.png`,
      }))
    )
  );
};

const LocationPicker = ({ onClose, onSelectFrom, onSelectTo }) => {
  const ref = useRef();
  const [cities] = useState(flattenCities());
  const [search, setSearch] = useState("");
  const [selectedStep, setSelectedStep] = useState(0); // 0 = Origin, 1 = Destination
  const [tempFrom, setTempFrom] = useState(null);
  const [tempTo, setTempTo] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const filteredCities = cities.filter(
    (city) =>
      city.city.toLowerCase().includes(search.toLowerCase()) ||
      city.code.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city) => {
    if (selectedStep === 0) {
      setTempFrom(city);
      setSelectedStep(1);
    } else {
      setTempTo(city);
      onSelectFrom(tempFrom || city);
      onSelectTo(city);
      // Reset after selection
      setTempFrom(null);
      setTempTo(null);
      setSelectedStep(0);
      setSearch("");
      onClose();
    }
  };

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 z-50 max-h-[400px]"
    >
      <div className="relative mb-4">
        <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search city, code, or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div className="space-y-1 overflow-y-auto max-h-[300px] pr-1">
        {filteredCities.map((city) => {
          const isFrom = tempFrom?.code === city.code;
          const isTo = tempTo?.code === city.code;
          return (
            <button
              type="button" // ✅ Prevents accidental form submission
              key={city.code}
              onClick={() => handleSelect(city)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-violet-100 transition text-left w-full ${
                isFrom || isTo ? "bg-violet-50 font-semibold" : ""
              }`}
            >
              <img src={city.flag} alt={city.country} className="w-5 h-4 rounded-sm" />
              <span className="flex-1 text-sm">
                {city.city} ({city.code}) — {city.country}{" "}
                {isFrom ? <span className="text-violet-600 text-xs">(Origin)</span> : null}
                {isTo ? <span className="text-indigo-600 text-xs">(Destination)</span> : null}
              </span>
            </button>
          );
        })}
        {filteredCities.length === 0 && <p className="text-center text-sm text-gray-500 py-4">No cities found.</p>}
      </div>

      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
        <X size={18} />
      </button>
    </div>
  );
};

export default LocationPicker;
