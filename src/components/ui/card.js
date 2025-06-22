export const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-md rounded-xl border ${className}`}>{children}</div>
);

export const CardHeader = ({ children }) => <div className="px-6 pt-4">{children}</div>;

export const CardTitle = ({ children, className = "" }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);

export const CardContent = ({ children }) => <div className="px-6 pb-6 space-y-2">{children}</div>;
