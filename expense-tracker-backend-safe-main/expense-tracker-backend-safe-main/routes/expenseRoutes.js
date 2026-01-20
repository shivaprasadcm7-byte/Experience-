const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const Expense = require("../models/Expense");
const User = require("../models/user");

// Apply middleware to all routes
router.use(protect);

// ---------------- ADD EXPENSE ----------------
router.post("/", async (req, res) => {
  try {
    console.log("REQ BODY 👉", req.body);

    console.log("REQ BODY 👉", req.body);

    const { title, amount, category, date, budgetLimit } = req.body;

    // Optional: Update Smart Budget if provided
    if (budgetLimit && !isNaN(budgetLimit)) {
      await User.findByIdAndUpdate(
        req.user.id,
        { $set: { [`budgets.${category}`]: Number(budgetLimit) } },
        { new: true, upsert: true }
      );
    }

    // STRICT VALIDATION
    if (
      !title ||
      typeof title !== "string" ||
      !category ||
      typeof category !== "string" ||
      !date ||
      amount === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required",
        received: req.body
      });
    }

    const expense = await Expense.create({
      title: title.trim(),
      amount: Number(amount),
      category: category.trim(),
      date: new Date(date),
      user: req.user.id
    });

    return res.status(201).json(expense);
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);
    return res.status(500).json({ message: "Failed to add expense" });
  }
});

// ---------------- GET EXPENSES ----------------
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    return res.json(expenses);
  } catch (error) {
    console.error("GET EXPENSE ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// ---------------- CATEGORY SUMMARY ----------------
router.get("/summary/category", async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1
        }
      }
    ]);

    return res.json(summary);
  } catch (error) {
    console.error("CATEGORY SUMMARY ERROR:", error);
    return res.status(500).json({ message: "Failed to get category summary" });
  }
});

// ---------------- MONTHLY SUMMARY ----------------
router.get("/summary/monthly", async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" }
                ]
              }
            ]
          },
          total: 1
        }
      }
    ]);

    return res.json(summary);
  } catch (error) {
    console.error("MONTHLY SUMMARY ERROR:", error);
    return res.status(500).json({ message: "Failed to get monthly summary" });
  }
});

// ---------------- DELETE EXPENSE ----------------
router.delete("/:id", async (req, res) => {
  try {
    const result = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!result) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }
    return res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
