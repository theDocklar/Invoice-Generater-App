import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";  

function TrendChart({ data = [] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
        <YAxis
          stroke="#6b7280"
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
          formatter={(value) => `$${value.toLocaleString()}`}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="paid"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.6}
          name="Paid"
        />
        <Area
          type="monotone"
          dataKey="outstanding"
          stackId="2"
          stroke="#f59e0b"
          fill="#f59e0b"
          fillOpacity={0.6}
          name="Outstanding"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default TrendChart;
