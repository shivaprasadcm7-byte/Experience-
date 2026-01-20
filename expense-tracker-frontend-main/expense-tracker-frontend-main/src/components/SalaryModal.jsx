import { useState } from "react";
import { updateSalary } from "../services/api";

export default function SalaryModal({ onSave }) {
  const [salary, setSalary] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!salary || salary <= 0) return alert("Enter valid salary");

    try {
      await updateSalary(salary);
      // Update local storage user just in case other components read from there
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.salary = salary;
        localStorage.setItem("user", JSON.stringify(user));
      }

      onSave(salary);
    } catch (err) {
      console.error("Failed to save salary", err);
      alert("Failed to save salary");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Set Monthly Salary</h2>
        <p className="modal-subtitle">
          This helps us track budgets and alerts
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Enter monthly salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <button type="submit">Save Salary</button>
        </form>
      </div>
    </div>
  );
}