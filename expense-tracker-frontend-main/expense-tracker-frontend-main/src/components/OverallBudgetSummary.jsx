import { useEffect, useState } from "react";
import { getExpenses, getUserProfile } from "../services/api";

export default function OverallBudgetSummary({ refresh }) {
  const [expenses, setExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch Expenses
    getExpenses()
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error(err));

    // Fetch User Profile for Budgets
    getUserProfile()
      .then((res) => {
        if (res.data && res.data.budgets) {
          // 🟢 Sum up all category budgets
          const total = Object.values(res.data.budgets).reduce(
            (acc, val) => acc + Number(val),
            0
          );
          setTotalBudget(total);
        }
      })
      .catch((err) => console.error(err));
  }, [refresh]);

  const totalSpent = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const percent =
    totalBudget > 0
      ? Math.min((totalSpent / totalBudget) * 100, 100)
      : 0;

  let status = "Safe";
  let statusClass = "safe";
  let barColor = "#2ed573";

  if (percent >= 100) {
    status = "Budget Exceeded";
    statusClass = "danger";
    barColor = "#ff4d4d";
  } else if (percent >= 80) {
    status = "Approaching Limit";
    statusClass = "warning";
    barColor = "#ffb703";
  }

  return (
    <div className="overall-budget-card">
      <h3>Overall Budget Summary</h3>

      <div className="summary-values">
        <span>Spent: ₹{totalSpent}</span>
        <span>Budget: ₹{totalBudget || "Set budgets"}</span>
      </div>

      <div className="budget-bar">
        <div
          className="budget-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: barColor
          }}
        />
      </div>

      <p className={`budget-status ${statusClass}`}>
        {status} ({percent.toFixed(0)}%)
      </p>
    </div>
  );
}