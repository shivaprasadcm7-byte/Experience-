import { useEffect, useState } from "react";
import { getExpenses } from "../services/api";
import CountUp from "react-countup";

export default function StatsCards({ refresh }) {
  const [stats, setStats] = useState({
    total: 0,
    count: 0,
    average: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getExpenses()
      .then((res) => {
        const expenses = res.data;
        const count = expenses.length;
        const total = expenses.reduce(
          (sum, e) => sum + Number(e.amount),
          0
        );
        const average = count === 0 ? 0 : Math.round(total / count);

        setStats({ total, count, average });
      })
      .catch((err) => console.error(err));
  }, [refresh]);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <p>Total Expenses</p>
        <h2>
          ₹
          <CountUp
            start={0}
            end={stats.total}
            duration={1.2}
            separator=","
          />
        </h2>
      </div>

      <div className="stat-card">
        <p>Total Entries</p>
        <h2>
          <CountUp
            start={0}
            end={stats.count}
            duration={1}
          />
        </h2>
      </div>

      <div className="stat-card">
        <p>Average Expense</p>
        <h2>
          ₹
          <CountUp
            start={0}
            end={stats.average}
            duration={1.2}
            separator=","
          />
        </h2>
      </div>
    </div>
  );
}