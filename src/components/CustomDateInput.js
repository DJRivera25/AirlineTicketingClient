import React from "react";
import { CalendarDays } from "lucide-react";

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="w-full flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-[10px] text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-inner"
    style={{ lineHeight: "1.25rem" }} // Match input
  >
    <CalendarDays size={16} className="text-violet-500 shrink-0" />
    <span className={value ? "text-gray-800" : "text-gray-400"}>{value || placeholder}</span>
  </button>
));

export default CustomDateInput;
