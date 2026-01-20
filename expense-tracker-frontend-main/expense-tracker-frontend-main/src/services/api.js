import axios from "axios";

const API = axios.create({
  baseURL: "https://experience-u2rf.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const getExpenses = () => API.get("/expenses");
export const addExpense = (data) => API.post("/expenses", data);

// ✅ Monthly report using fetch (as requested)
export const getMonthlyReport = async (month, year) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `https://experience-u2rf.onrender.com/api/reports/monthly?month=${month}&year=${year}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch report");
  }

  return res.json();
};

export const updateSalary = (salary) => API.put("/user/salary", { salary });
export const updateBudget = (category, limit) => API.put("/user/budget", { category, limit });
export const getUserProfile = () => API.get("/user/profile"); // ✅ Added

// Statistics & Insights
export const getInsights = () => API.get("/insights");
export const getCategorySummary = () => API.get("/expenses/summary/category");
export const getMonthlySummary = () => API.get("/expenses/summary/monthly");
