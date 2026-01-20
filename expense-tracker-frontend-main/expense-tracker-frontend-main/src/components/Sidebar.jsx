import {
  FiHome,
  FiBarChart2,
  FiPlus
} from "react-icons/fi";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { TbReportAnalytics } from "react-icons/tb";
import { IoLanguage } from "react-icons/io5"; // ✅ Translator Icon

export default function Sidebar({ onAdd, onTranslate }) {
  const scrollTo = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sidebar">
      {/* Home */}
      <FiHome
        className="side-icon"
        onClick={() => scrollTo("home")}
      />

      {/* Analytics */}
      <FiBarChart2
        className="side-icon"
        onClick={() => scrollTo("analytics")}
      />

      {/* Budget */}
      <MdOutlineAccountBalanceWallet
        className="side-icon"
        onClick={() => scrollTo("budget")}
      />

      {/* Smart Insights (SCROLL) */}
      <HiOutlineLightBulb
        className="side-icon"
        onClick={() => scrollTo("smart-insights")}
      />

      {/* Monthly Report (SCROLL) */}
      <TbReportAnalytics
        className="side-icon"
        onClick={() => scrollTo("monthly-report")}
      />

      {/* 🌍 Translate Trigger */}
      <IoLanguage
        className="side-icon"
        onClick={onTranslate}
        title="Translate Language"
      />

      {/* Add Expense */}
      <FiPlus
        className="side-icon add-expense"
        onClick={onAdd}
      />
    </div>
  );
}
