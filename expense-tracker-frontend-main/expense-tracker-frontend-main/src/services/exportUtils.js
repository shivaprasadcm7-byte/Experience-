import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

/* ========= PDF ========= */
export const exportPDF = async () => {
  const el = document.getElementById("pdf-report");
  el.style.display = "block";

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff"
  });

  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const w = pdf.internal.pageSize.getWidth();
  const h = (canvas.height * w) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, w, h);
  pdf.save("Monthly_Expense_Report.pdf");

  el.style.display = "none";
};

/* ========= EXCEL ========= */
export const exportExcel = (report) => {
  if (!report) return;

  const summary = [
    { Metric: "Total Budget", Value: report.budget },
    { Metric: "Spent This Month", Value: report.totalSpent },
    { Metric: "Spent Last Month", Value: report.prevSpent },
    { Metric: "Remaining Balance", Value: report.remaining },
    { Metric: "Difference", Value: report.difference }
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summary);

  const categorySheet = XLSX.utils.json_to_sheet(
    report.categoryComparison.map(c => ({
      Category: c.category,
      "This Month": c.current,
      "Last Month": c.previous,
      Difference: c.difference
    }))
  );

  const expenseSheet = XLSX.utils.json_to_sheet(
    report.expenses.map(e => ({
      Date: new Date(e.date).toLocaleDateString(),
      Category: e.category,
      Amount: e.amount
    }))
  );

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");
  XLSX.utils.book_append_sheet(wb, categorySheet, "Category Comparison");
  XLSX.utils.book_append_sheet(wb, expenseSheet, "Expenses");

  XLSX.writeFile(wb, "Monthly_Expense_Report.xlsx");
};
