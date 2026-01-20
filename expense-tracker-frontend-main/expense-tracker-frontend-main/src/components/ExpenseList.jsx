import { useEffect, useState } from "react";
import { getExpenses } from "../services/api";
import ExpenseCard from "./ExpenseCard";

export default function ExpenseList({ refresh }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getExpenses()
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error(err));
  }, [refresh]);

  return (
    <div className="expense-list">
      {expenses.length === 0 ? (
        <p className="empty">No expenses added yet</p>
      ) : (
        expenses.map((exp) => (
          <ExpenseCard key={exp._id} expense={exp} />
        ))
      )}
    </div>
  );
}