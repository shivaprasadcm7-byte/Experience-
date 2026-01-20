import { useState, useEffect } from "react";

// API & Utilities
import { getMonthlyReport } from "../services/api";
import { exportPDF, exportExcel } from "../services/exportUtils";

// Components
import ExpenseList from "../components/ExpenseList";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import MonthlyBarChart from "../components/charts/MonthlyBarChart";
import CategoryComparisonChart from "../components/charts/CategoryComparisonChart";
import AddExpenseModal from "../components/AddExpenseModal";
import StatsCards from "../components/StatsCards";
import RecentTransactions from "../components/RecentTransactions";
import Sidebar from "../components/Sidebar";
import SalaryModal from "../components/SalaryModal";
import SmartBudget from "../components/SmartBudget";
import OverallBudgetSummary from "../components/OverallBudgetSummary";
import SmartInsights from "../components/SmartInsights";
import ReportPDF from "../components/ReportPDF";
import AuthProfile from "../components/AuthProfile";

export default function Dashboard() {
  // ✅ State Management
  const [showTranslate, setShowTranslate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [salary, setSalary] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.salary : null;
  });

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const reloadData = () => setRefresh((prev) => !prev);

  useEffect(() => {
    // 🌍 Google Translate Script Injection
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    if (!window.google || !window.google.translate) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,ta,te,mr,gu,kn,ml,pa,bn,ur", // Common Indian Languages
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
      addGoogleTranslateScript();
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getMonthlyReport(month, year)
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [refresh]);

  return (
    <div className="dashboard-wrapper">
      {/* 🌍 Translator Widget (Hidden/Styled in CSS) */}
      <div
        id="google_translate_element"
        style={{
          position: "fixed",
          bottom: "80px",
          left: "90px",
          zIndex: 9999,
          opacity: showTranslate ? 1 : 0,
          pointerEvents: showTranslate ? "auto" : "none",
          transition: "opacity 0.3s ease"
        }}
      ></div>

      {/* Sidebar */}
      <Sidebar
        onAdd={() => setShowModal(true)}
        onTranslate={() => setShowTranslate(prev => !prev)}
      />

      {/* Main Dashboard */}
      <div className="dashboard">
        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1 className="title">Expense Tracker</h1>
            <p className="subtitle">Track your spending beautifully</p>
          </div>

          {/* ✅ AUTH PROFILE */}
          <AuthProfile />
        </div>

        {/* Salary Banner */}
        {salary && (
          <div className="salary-banner">
            💰 Monthly Salary: ₹{Number(salary).toLocaleString()}
          </div>
        )}

        {/* HOME */}
        <section id="home">
          <StatsCards refresh={refresh} />
        </section>

        {/* ANALYTICS */}
        <section id="analytics">
          <div className="charts">
            <CategoryPieChart refresh={refresh} />
            <MonthlyBarChart refresh={refresh} />
          </div>
        </section>

        {/* BUDGET SUMMARY */}
        <section id="budget-summary">
          <OverallBudgetSummary refresh={refresh} />
        </section>

        {/* SMART BUDGET */}
        <section id="budget">
          <SmartBudget refresh={refresh} />
        </section>

        {/* SMART INSIGHTS */}
        <section id="smart-insights">
          <SmartInsights refresh={refresh} />
        </section>

        {/* MONTHLY REPORT */}
        <section id="monthly-report">
          {!loading && report && (
            <>
              <div id="export-report" className="insight-glass">
                <h3>📊 Monthly Report</h3>

                <p>Total Budget: ₹{report.budget}</p>
                <p>Spent This Month: ₹{report.totalSpent}</p>
                <p>Spent Last Month: ₹{report.prevSpent}</p>
                <p>Remaining Balance: ₹{report.remaining}</p>

                <p>
                  Change:
                  {report.difference > 0 ? " 🔺 Over" : " 🟢 Under"} ₹
                  {Math.abs(report.difference)}
                </p>

                {report.categoryComparison && (
                  <CategoryComparisonChart
                    data={report.categoryComparison}
                  />
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <button onClick={exportPDF}>📄 Export PDF</button>
                <button onClick={() => exportExcel(report)}>
                  📊 Export Excel
                </button>
              </div>

              <ReportPDF report={report} />
            </>
          )}
        </section>

        {/* TRANSACTIONS */}
        <RecentTransactions refresh={refresh} />
        <ExpenseList refresh={refresh} />

        {/* ADD EXPENSE */}
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add Expense
        </button>

        {showModal && (
          <AddExpenseModal
            onClose={() => setShowModal(false)}
            onAdded={reloadData}
          />
        )}

        {/* SALARY MODAL */}
        {!salary && <SalaryModal onSave={(value) => setSalary(value)} />}
      </div>
    </div>
  );
}
