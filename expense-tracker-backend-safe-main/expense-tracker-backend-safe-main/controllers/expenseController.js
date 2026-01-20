const Expense = require("../models/Expense");
const User = require("../models/user");

// ADD EXPENSE
exports.addExpense = async (req, res) => {
  try {
    // Optional: Update Smart Budget if provided
    if (budgetLimit) {
      /* 
         Using findByIdAndUpdate with dot notation is the standard way 
         to update Mongoose Map values atomically without fetching the document first.
      */
      await User.findByIdAndUpdate(
        req.user.id,
        { $set: { [`budgets.${category}`]: Number(budgetLimit) } },
        { new: true, upsert: true }
      );
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      date,
      user: req.user.id
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Failed to add expense", error });
  }
};

// GET ALL EXPENSES
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses", error });
  }
};