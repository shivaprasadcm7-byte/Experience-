const ReportPDF = ({ report }) => {
  if (!report) return null;

  return (
    <div
      id="pdf-report"
      style={{
        display: "none",
        width: "794px",
        padding: "24px",
        background: "#fff",
        color: "#000"
      }}
    >
      <h2>📊 Monthly Expense Report</h2>

      <p><b>Total Budget:</b> ₹{report.budget}</p>
      <p><b>Spent This Month:</b> ₹{report.totalSpent}</p>
      <p><b>Spent Last Month:</b> ₹{report.prevSpent}</p>
      <p><b>Remaining Balance:</b> ₹{report.remaining}</p>

      <h3>Category Comparison</h3>
      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Category</th>
            <th>This Month</th>
            <th>Last Month</th>
            <th>Difference</th>
          </tr>
        </thead>
        <tbody>
          {report.categoryComparison && report.categoryComparison.length > 0 ? (
            report.categoryComparison.map((c, i) => (
              <tr key={i}>
                <td>{c.category}</td>
                <td>₹{c.current}</td>
                <td>₹{c.previous}</td>
                <td>₹{c.difference}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">No data available</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportPDF;
