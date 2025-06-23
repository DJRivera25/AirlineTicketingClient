import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Plane, Clock, MapPin, Briefcase, Info, ArrowLeft, ArrowRight } from "lucide-react";
import SeatMap from "../components/SeatMap";
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

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [seatMap, setSeatMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goBackToSearch = () => navigate("/flights");
  const continueToBooking = () => navigate(`/booking/${id}`);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASEURL}/flights/${id}`);
        setFlight(res.data);
      } catch {
        setError("Unable to load flight details.");
      }
    };

    const fetchSeatMap = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASEURL}/seats/flight/${id}`);
        setSeatMap(res.data);
      } catch {
        setSeatMap([]);
      }
    };

    fetchFlightDetails();
    fetchSeatMap();
    setLoading(false);
  }, [id]);

  if (loading) return <p className="text-center text-gray-500">Loading flight details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!flight) return <p className="text-center text-gray-500">Flight not found.</p>;

  const cityList = flattenCities();
  const depOriginCity = cityList.find((c) => flight.from.includes(c.code));
  const depDestinationCity = cityList.find((c) => flight.to.includes(c.code));

  const {
    flightNumber,
    airline,
    from,
    to,
    departureTime,
    arrivalTime,
    aircraft = "Airbus A330-300",
    seatCapacity,
    duration,
  } = flight;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 text-sm md:text-base">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-violet-700 flex items-center gap-2">
          <Plane className="w-6 h-6" /> Flight Details
        </h1>
        <button
          className="text-xs md:text-sm flex items-center gap-1 text-violet-600 hover:text-violet-800 underline"
          onClick={goBackToSearch}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Itinerary */}
      <section className="bg-white p-4 md:p-5 shadow rounded-lg border space-y-1">
        <div className="flex items-center gap-2 text-violet-600 font-semibold">
          <MapPin size={16} /> Itinerary
        </div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-700">{airline}</p>
        </div>
        <p>
          <strong>Flight:</strong> {flightNumber}
        </p>
        <p className="flex gap-2">
          <strong>Route:</strong> <img src={depOriginCity.flag} className="w-6 h-auto rounded" /> {from} →
          <img src={depDestinationCity.flag} className="w-6 h-auto rounded" /> {to}
        </p>
        <p>
          <strong>Departure:</strong> {new Date(departureTime).toLocaleString()}
        </p>
        <p>
          <strong>Arrival:</strong> {new Date(arrivalTime).toLocaleString()}
        </p>
        <p className="text-gray-600 flex items-center gap-1">
          <Clock size={14} /> <strong>Duration:</strong> {duration}
        </p>
      </section>

      {/* Aircraft Info */}
      <section className="bg-white p-4 md:p-5 shadow rounded-lg border space-y-1">
        <h2 className="font-semibold text-violet-600 flex items-center gap-2">
          <Plane size={16} /> Aircraft
        </h2>
        <p>
          <strong>Model:</strong> {aircraft}
        </p>
        <p>
          <strong>Seats:</strong> {seatCapacity}
        </p>
      </section>

      {/* Seat Map */}
      <section className="bg-white p-4 md:p-5 shadow rounded-lg border space-y-2">
        <h2 className="font-semibold text-violet-600 flex items-center gap-2">
          <MapPin size={16} /> Seat Map
        </h2>
        <SeatMap seats={seatMap} onSeatClick={null} />
      </section>

      {/* Baggage Info */}
      <section className="bg-white p-4 md:p-5 shadow rounded-lg border">
        <div className="flex items-center gap-2 text-violet-600 font-semibold">
          <Briefcase size={16} /> Baggage
        </div>
        <ul className="list-disc ml-5 space-y-1 text-gray-700">
          <li>1 carry-on (7kg max)</li>
          <li>1 checked baggage (20kg max)</li>
          <li>Excess fees may apply</li>
        </ul>
      </section>

      {/* Services */}
      <section className="bg-white p-4 md:p-5 shadow rounded-lg border">
        <div className="flex items-center gap-2 text-violet-600 font-semibold">
          <Info size={16} /> Services
        </div>
        <ul className="list-disc ml-5 space-y-1 text-gray-700">
          <li>Complimentary meals</li>
          <li>Wi-Fi (limited)</li>
          <li>Entertainment system</li>
          <li>Power outlets</li>
        </ul>
      </section>

      {/* Terms */}
      <section className="bg-white p-4 md:p-5 shadow rounded-lg border">
        <h2 className="font-semibold text-violet-600 flex items-center gap-2">
          <Info size={16} /> Terms
        </h2>
        <ul className="list-disc ml-5 space-y-1 text-gray-600 text-xs md:text-sm">
          <li>Non-refundable ticket</li>
          <li>Rebooking allowed with fees</li>
          <li>Check-in at least 2 hours early</li>
          <li>Passport valid 6+ months</li>
          <li>Subject to change without notice</li>
        </ul>
      </section>

      <div className="text-end">
        <button
          onClick={continueToBooking}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full shadow-md flex items-center gap-2"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FlightDetails;
