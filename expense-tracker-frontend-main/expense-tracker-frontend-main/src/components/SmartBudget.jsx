import { useEffect, useState } from "react";
import { updateBudget, getExpenses, getUserProfile } from "../services/api";

export default function SmartBudget({ refresh }) {
  const [expenses, setExpenses] = useState([]);

  // Initialize budgets from user profile in localStorage (which is populated on login)
  const [budgets, setBudgets] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.budgets || {};
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getExpenses()
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));

    // ✅ Fetch fresh user profile to update budgets from backend changes (Add Expense modal)
    getUserProfile()
      .then(res => {
        const updatedUser = res.data;
        if (updatedUser && updatedUser.budgets) {
          setBudgets(updatedUser.budgets);

          // Also sync localStorage so other components/reloads are fresh
          const localUser = JSON.parse(localStorage.getItem("user")) || {};
          const merged = { ...localUser, ...updatedUser }; // ensure we keep token or other fields if any
          localStorage.setItem("user", JSON.stringify(merged));
        }
      })
      .catch(err => console.error("Failed to sync budget", err));

  }, [refresh]);

  // 🔥 Dynamic category totals
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  const handleBudgetChange = async (cat, value) => {
    const updated = { ...budgets, [cat]: value };
    setBudgets(updated);

    // Update backend
    try {
      await updateBudget(cat, value);

      // Update local storage user
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.budgets = updated;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (err) {
      console.error("Failed to update budget", err);
    }
  };

  return (
    <div className="smart-budget-card">
      <h3>Smart Budget</h3>

      {Object.keys(categoryTotals).map(cat => {
        const spent = categoryTotals[cat];
        const limit = budgets[cat] || 0;
        const percent = limit ? (spent / limit) * 100 : 0;

        let status = "safe";
        if (percent >= 100) status = "danger";
        else if (percent >= 80) status = "warning";

        return (
          <div key={cat} className="budget-row">
            <div className="budget-header">
              <span className="cat-name">{cat}</span>
              <span className="cat-amount">
                ₹{spent} / ₹{limit || "Set"}
              </span>
            </div>

            <div className="budget-bar">
              <div
                className={`budget-fill ${status}`}
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>

            <div className="budget-footer">
              <input
                type="number"
                placeholder="Set Budget"
                value={limit}
                onChange={e => handleBudgetChange(cat, e.target.value)}
              />
              <span className={`budget-status ${status}`}>
                {status === "safe"
                  ? "Safe"
                  : status === "warning"
                    ? "Warning"
                    : "Exceeded"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}