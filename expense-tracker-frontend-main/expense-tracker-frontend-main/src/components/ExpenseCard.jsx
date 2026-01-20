export default function ExpenseCard({ expense }) {
  return (
    <div className="expense-card">
      <div>
        <h3>{expense.title}</h3>
        <p className="category">{expense.category}</p>
      </div>
      <div className="amount">₹{expense.amount}</div>
    </div>
  );
}