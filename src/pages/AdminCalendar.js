import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { CalendarDays, PlaneTakeoff, PlaneLanding, Clock, MapPin } from "lucide-react";
import locations from "../data/Locations";
import dayjs from "dayjs";
import TooltipPortal from "../components/TooltipPortal";

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

const getCountryDetails = (code) => {
  for (const region of locations) {
    for (const country of region.countries) {
      for (const city of country.cities) {
        if (city.code === code) {
          return {
            code,
            flag: `https://flagcdn.com/24x18/${countryToFlagCode[country.country] || "un"}.png`,
            city: city.name,
          };
        }
      }
    }
  }
  return { code, flag: null, city: code };
};

const getCountryCode = (location) => {
  const match = location.match(/\(([^)]+)\)/);
  return match ? match[1] : location;
};

const AdminCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASEURL}/flights?limit=1000`);
        const flightEvents = response.data.flights.map((flight) => {
          const fromCode = getCountryCode(flight.from);
          const toCode = getCountryCode(flight.to);
          const fromDetails = getCountryDetails(fromCode);
          const toDetails = getCountryDetails(toCode);

          return {
            id: flight._id,
            title: `${fromCode} → ${toCode}`,
            flightNumber: flight.flightNumber,
            start: flight.departureTime,
            allDay: true, // ✅ prevents multiday vertical stretching
            extendedProps: {
              flagFrom: fromDetails.flag,
              flagTo: toDetails.flag,
              fromCity: fromDetails.city,
              toCity: toDetails.city,
              flightNumber: flight.flightNumber,
              airline: flight.airline,
              departureTime: flight.departureTime,
              arrivalTime: flight.arrivalTime,
              duration: flight.duration,
            },
          };
        });
        setEvents(flightEvents);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch flights:", err);
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const handleEventClick = (clickInfo) => {
    const flightId = clickInfo.event.id;
    if (flightId) window.open(`/admin/flights/${flightId}`, "_blank");
  };

  const renderEventContent = (eventInfo) => {
    const { flagFrom, flagTo, airline, flightNumber, departureTime, arrivalTime, duration, fromCity, toCity } =
      eventInfo.event.extendedProps;

    return (
      <div
        className="relative bg-violet-100 hover:bg-violet-200 transition p-2 rounded-xl shadow-sm text-[11px] text-violet-800 flex flex-col items-center justify-center w-full max-w-[140px] mx-auto group cursor-pointer min-h-[40px]"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const initialLeft = rect.left + window.scrollX;
          const initialTop = rect.top + window.scrollY + rect.height + 8;

          const tooltipWidth = 260;
          const margin = 8;
          let left = initialLeft;

          if (left + tooltipWidth + margin > window.scrollX + window.innerWidth) {
            left = window.scrollX + window.innerWidth - tooltipWidth - margin;
          }
          if (left < window.scrollX + margin) {
            left = window.scrollX + margin;
          }

          setTooltipPosition({ top: initialTop, left });
          setHoveredEvent({ airline, flightNumber, fromCity, toCity, departureTime, arrivalTime, duration });
        }}
        onMouseLeave={() => setHoveredEvent(null)}
      >
        <div className="flex items-center gap-1">
          {flagFrom && <img src={flagFrom} alt={`${fromCity} Flag`} className="w-4 h-3 rounded-sm border" />}
          <span className="font-semibold truncate max-w-[100px]">{eventInfo.event.title}</span>
          {flagTo && <img src={flagTo} alt={`${toCity} Flag`} className="w-4 h-3 rounded-sm border" />}
        </div>
        <span className="text-[10px] text-violet-600 font-medium truncate">
          <a
            href={`/admin/flights/${eventInfo.event.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-violet-800"
          >
            {flightNumber}
          </a>
        </span>
      </div>
    );
  };

  return (
    <section className="w-full px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="w-8 h-8 text-violet-700" />
        <h1 className="text-4xl font-extrabold tracking-tight text-violet-800">Flight Operations Calendar</h1>
      </div>

      <p className="text-sm text-violet-500 mb-6 max-w-2xl">
        View all active and upcoming flights per day. Hover to preview flight details. Click flight number to view full
        details.
      </p>

      <div className="bg-white rounded-3xl border border-violet-200 shadow-xl p-6 overflow-visible min-h-[400px] relative z-0">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-[1000]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-violet-500 border-solid"></div>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            height="auto"
            contentHeight="auto"
            aspectRatio={1.5}
            nowIndicator={true}
            eventDisplay="block"
            eventOrderStrict={true}
            eventOrder="start"
            fixedWeekCount={false}
            displayEventTime={false}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
          />
        )}
      </div>

      {hoveredEvent && (
        <TooltipPortal position={tooltipPosition}>
          <div className="bg-white border border-violet-300 shadow-2xl rounded-xl p-3 text-[11px] w-[260px] text-violet-800 space-y-1 z-[9999]">
            <div className="text-[12px] font-bold text-violet-700">
              {hoveredEvent.airline} {hoveredEvent.flightNumber}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-violet-500" />
              <span className="font-medium">Route:</span>
              <span className="text-sm">
                {hoveredEvent.fromCity} → {hoveredEvent.toCity}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <PlaneTakeoff className="w-3 h-3 text-violet-500" />
              <span className="font-medium">Departure:</span>
              <span className="text-sm">{dayjs(hoveredEvent.departureTime).format("MMM D, YYYY h:mm A")}</span>
            </div>
            <div className="flex items-center gap-1">
              <PlaneLanding className="w-3 h-3 text-violet-500" />
              <span className="font-medium">Arrival:</span>
              <span className="text-sm">{dayjs(hoveredEvent.arrivalTime).format("MMM D, YYYY h:mm A")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-violet-500" />
              <span className="font-medium">Duration:</span>
              <span className="text-sm">{hoveredEvent.duration}</span>
            </div>
          </div>
        </TooltipPortal>
      )}

      <style>{`
        .fc {
          font-family: 'Inter', sans-serif;
        }

        .fc .fc-toolbar-title {
          color: #7c3aed;
          font-weight: 800;
          font-size: 1.5rem;
        }

        .fc .fc-button {
          background-color: #7c3aed !important;
          border: none !important;
          color: #fff !important;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 6px rgba(124, 58, 237, 0.25);
          transition: all 0.2s;
        }

        .fc .fc-button:hover {
          background-color: #6d28d9 !important;
        }

        .fc .fc-button:disabled {
          background-color: #e4e4e7 !important;
          color: #a1a1aa !important;
        }

        .fc .fc-daygrid-day-number {
          color: #7c3aed !important;
          font-weight: 600;
        }

        .fc .fc-col-header-cell-cushion {
          color: #7c3aed !important;
          font-weight: 700;
        }

        .fc .fc-day-today {
          background-color: #f3e8ff !important;
        }

        .fc-theme-standard td,
        .fc-theme-standard th {
          border: 1px solid #e0d4f7;
        }

        .fc-scrollgrid {
          border-radius: 1rem;
          overflow: visible !important;
        }

        .fc-event {
          background: transparent !important;
          border: none !important;
          padding: 0 !important;
        }

        .fc-daygrid-event {
          margin-bottom: 2px !important;
          line-height: 1.2 !important;
        }

        .fc-daygrid-event .fc-event-time {
          display: none !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .fc-event-main {
          padding: 0 !important;
        }

        .fc-daygrid-event-harness,
        .fc-daygrid-day-frame {
          overflow: visible !important;
          position: relative !important;
        }
      `}</style>
    </section>
  );
};

export default AdminCalendar;
