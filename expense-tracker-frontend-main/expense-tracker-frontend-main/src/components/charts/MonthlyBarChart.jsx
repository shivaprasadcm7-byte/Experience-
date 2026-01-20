import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { getMonthlySummary } from "../../services/api";
import "./chartConfig";

export default function MonthlyBarChart({ refresh }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getMonthlySummary()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [refresh]);

  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h2>Monthly Expenses</h2>
        <p style={{ textAlign: "center", color: "#aaa" }}>
          No data available
        </p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Expenses",
        data: data.map((d) => d.total),
        backgroundColor: "rgba(0, 240, 255, 0.6)", // 🔥 bright cyan
        borderColor: "#00f0ff",
        borderWidth: 2,
        borderRadius: 12,
        maxBarThickness: 60
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#ffffff"
        }
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#00f0ff",
        bodyColor: "#ffffff",
        borderColor: "#00f0ff",
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#b3b9ff"
        },
        grid: {
          color: "rgba(255,255,255,0.1)"
        }
      },
      y: {
        ticks: {
          color: "#b3b9ff"
        },
        grid: {
          color: "rgba(255,255,255,0.1)"
        }
      }
    }
  };

  return (
    <div className="chart-card" style={{ height: "320px" }}>
      <h2>Monthly Expenses</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}