function StatCard({ title, value, icon, trend, variant = "default" }) {
  const variants = {
    default: "bg-white border-gray-200",
    primary: "bg-blue-50 border-blue-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    danger: "bg-red-50 border-red-200",
  };

  const iconColors = {
    default: "text-gray-600",
    primary: "text-blue-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
  };

  return (
    <div className={`${variants[variant]} border rounded-lg p-6 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              {trend.direction === "up" ? (
                <svg
                  className="w-4 h-4 text-green-500 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-red-500 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              )}
              <span
                className={
                  trend.direction === "up" ? "text-green-600" : "text-red-600"
                }
              >
                {trend.value}
              </span>
              <span className="text-gray-500 ml-1">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={`p-3 rounded-lg ${variants[variant]} ${iconColors[variant]}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
