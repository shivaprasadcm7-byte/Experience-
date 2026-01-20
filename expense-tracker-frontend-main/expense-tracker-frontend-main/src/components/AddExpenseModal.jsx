import { useState } from "react";
import { addExpense } from "../services/api";

export default function AddExpenseModal({ onClose, onAdded }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [budgetLimit, setBudgetLimit] = useState(""); // ✅ New state

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Include date in validation
    if (!title || !amount || !category || !date) {
      alert("Please fill all fields");
      return;
    }

    try {
      const expenseData = {
        title,
        amount,
        category,
        date,
        budgetLimit
      };

      await addExpense(expenseData);
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add Expense</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Rent">Rent</option>
            <option value="Utilities">Utilities</option>
            <option value="Shopping">Shopping</option>
            <option value="Education">Education</option>
            <option value="Medical">Medical</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transportation">Transportation</option>
            <option value="Groceries">Groceries</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Health & Fitness">Health & Fitness</option>
            <option value="Subscriptions">Subscriptions</option>
            <option value="Bills & Payments">Bills & Payments</option>
            <option value="Others">Others</option>
          </select>
          {/* ✅ Date picker */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          {/* ✅ Smart Budget Input */}
          <input
            type="number"
            placeholder="Set Smart Budget for this Category (Optional)"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(e.target.value)}
            style={{ marginTop: "10px", border: "1px solid #7c7cff" }}
          />
          <button type="submit">Add</button>
        </form>
        <button className="close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
