import { useEffect, useState } from "react";
import { getExpenses } from "../services/api";

export default function RecentTransactions({ refresh }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getExpenses()
      .then((res) => {
        // take last 5, newest first
        setTransactions(res.data.slice(0, 5));
      })
      .catch((err) => console.error(err));
  }, [refresh]);

  return (
    <div className="recent-card">
      <h2>Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p className="empty">No transactions yet</p>
      ) : (
        transactions.map((t) => (
          <div className="transaction-item" key={t._id}>
            <div>
              <p className="tx-title">{t.title}</p>
              <span className="tx-category">{t.category}</span>
            </div>

            <div className="tx-amount">₹{t.amount}</div>
          </div>
        ))
      )}
    </div>
  );
}