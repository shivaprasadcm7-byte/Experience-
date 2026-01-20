import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SmartInsights from "./components/SmartInsights";
import ReportPDF from "./components/ReportPDF";

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/insights" element={<SmartInsights />} />
          <Route path="/monthly-report" element={<ReportPDF />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
