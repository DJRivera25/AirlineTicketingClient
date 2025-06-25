import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Plane, Clock, MapPin, Briefcase, Info, ArrowLeft, ArrowRight } from "lucide-react";
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
  const location = useLocation();
  const fromPath = location.state?.fromPath || "/";
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goBackToSearch = () => navigate(fromPath);
  console.log(`came from:`, fromPath);
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

    fetchFlightDetails();
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
    availableSeats,
  } = flight;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-sm md:text-base">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-violet-700 flex items-center gap-2">
          <Plane className="w-6 h-6" /> Flight Details
        </h1>
        <button
          className="text-sm text-violet-600 hover:text-violet-800 underline flex items-center gap-1"
          onClick={goBackToSearch}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Reusable Section Style */}
      {[
        {
          title: "Itinerary",
          icon: <MapPin size={16} />,
          content: (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <p className="font-medium text-gray-700">{airline}</p>
              </div>
              <p>
                <strong>Flight:</strong> {flightNumber}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <strong>Route:</strong>
                <div className="flex items-center gap-1">
                  <img src={depOriginCity.flag} className="w-5 h-auto rounded" />
                  <span>{from}</span>
                  <span className="mx-1">→</span>
                  <img src={depDestinationCity.flag} className="w-5 h-auto rounded" />
                  <span>{to}</span>
                </div>
              </div>
              <p>
                <strong>Departure:</strong> {new Date(departureTime).toLocaleString()}
              </p>
              <p>
                <strong>Arrival:</strong> {new Date(arrivalTime).toLocaleString()}
              </p>
              <p className="text-gray-600 flex items-center gap-1">
                <Clock size={14} /> <strong>Duration:</strong> {duration}
              </p>
            </>
          ),
        },
        {
          title: "Aircraft",
          icon: <Plane size={16} />,
          content: (
            <>
              <p>
                <strong>Model:</strong> {aircraft}
              </p>
              <p>
                <strong>Available Seats:</strong> {availableSeats}
              </p>
            </>
          ),
        },
        {
          title: "Baggage",
          icon: <Briefcase size={16} />,
          content: (
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              <li>1 carry-on (7kg max)</li>
              <li>1 checked baggage (20kg max)</li>
              <li>Excess fees may apply</li>
            </ul>
          ),
        },
        {
          title: "Services",
          icon: <Info size={16} />,
          content: (
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              <li>Complimentary meals</li>
              <li>Wi-Fi (limited)</li>
              <li>Entertainment system</li>
              <li>Power outlets</li>
            </ul>
          ),
        },
        {
          title: "Terms",
          icon: <Info size={16} />,
          content: (
            <ul className="list-disc ml-5 space-y-1 text-gray-600 text-xs sm:text-sm">
              <li>Non-refundable ticket</li>
              <li>Rebooking allowed with fees</li>
              <li>Check-in at least 2 hours early</li>
              <li>Passport valid 6+ months</li>
              <li>Subject to change without notice</li>
            </ul>
          ),
        },
      ].map(({ title, icon, content }, index) => (
        <section key={index} className="bg-white p-4 sm:p-5 shadow rounded-lg border space-y-2">
          <h2 className="font-semibold text-violet-600 flex items-center gap-2">
            {icon} {title}
          </h2>
          {content}
        </section>
      ))}

      <div className="text-end">
        <button
          onClick={continueToBooking}
          className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full shadow-md flex justify-center sm:inline-flex items-center gap-2"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FlightDetails;
