require("dotenv").config();


const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// -------- MIDDLEWARE (ORDER IS VERY IMPORTANT) --------
app.use(cors());
app.use(express.json()); // <-- THIS IS CRITICAL

// -------- DATABASE CONNECTION --------
connectDB();

// -------- TEST ROUTE --------
app.get("/", (req, res) => {
  res.json({ status: "Backend + MongoDB running successfully" });
});

// -------- ROUTES --------

// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// Expense routes
app.use("/api/expenses", require("./routes/expenseRoutes"));

// Insight routes
app.use("/api/insights", require("./routes/insightRoutes"));

// ✅ Report routes (ADDED AS REQUESTED)
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

// User routes (Profile, Salary, Budgets)
app.use("/api/user", require("./routes/userRoutes"));

// -------- START SERVER --------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
