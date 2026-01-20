import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getCategorySummary } from "../../services/api";
import "./chartConfig";

export default function CategoryPieChart({ refresh }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getCategorySummary()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [refresh]);

  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h2>Category Distribution</h2>
        <p style={{ textAlign: "center", color: "#aaa" }}>
          No data available
        </p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.category),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: [
          "#7c7cff",
          "#00f0ff",
          "#ff9f43",
          "#ff6b81",
          "#2ed573"
        ],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="chart-card">
      <h2>Category Distribution</h2>
      <Pie data={chartData} />
    </div>
  );
}