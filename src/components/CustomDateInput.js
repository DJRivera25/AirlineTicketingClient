import React from "react";
import { CalendarDays } from "lucide-react";

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="w-full border border-gray-300 rounded-xl px-3 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner text-left relative flex items-center justify-between gap-4 transition hover:border-violet-400"
  >
    {/* Left: Text Content */}
    <div className="flex-1 text-sm">
      {value ? (
        <span className="text-gray-700 font-medium">{value}</span>
      ) : (
        <span className="text-gray-400">{placeholder}</span>
      )}
    </div>

    {/* Right: Calendar Icon */}
    <CalendarDays className="w-5 h-5 text-violet-500 shrink-0" />
  </button>
));

export default CustomDateInput;
