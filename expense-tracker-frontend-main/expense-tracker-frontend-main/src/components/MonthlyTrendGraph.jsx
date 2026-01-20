import { useEffect, useState } from "react";
import { getMonthlySummary } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function MonthlyTrendGraph({ refresh }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getMonthlySummary()
      .then((res) => setData(res.data))
      .catch((err) =>
        console.error("MONTHLY TREND ERROR:", err)
      );
  }, [refresh]);

  if (!data.length) return null;

  return (
    <div className="monthly-trend-graph" style={{ width: "100%", height: 250, minHeight: 250, minWidth: 200 }}>
      <ResponsiveContainer minWidth={200} minHeight={200}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <XAxis dataKey="month" stroke="#a0a0a0" />
          <YAxis stroke="#a0a0a0" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111",
              border: "none",
              color: "#fff"
            }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#00e0ff"
            strokeWidth={3}
            dot={{ r: 5, fill: "#00e0ff" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
