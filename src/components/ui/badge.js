export const Badge = ({ children, color = "violet", className = "" }) => (
  <span className={`inline-block px-2 py-1 text-xs font-medium rounded bg-${color}-100 text-${color}-800 ${className}`}>
    {children}
  </span>
);
