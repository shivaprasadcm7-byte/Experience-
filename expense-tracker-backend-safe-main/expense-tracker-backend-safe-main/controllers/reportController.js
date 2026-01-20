const Expense = require("../models/Expense");

exports.getMonthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year required" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

    const prevStart = new Date(year, month - 2, 1);
    const prevEnd = new Date(year, month - 1, 0);

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: start, $lte: end }
    });

    const prevExpenses = await Expense.find({
      user: req.user.id,
      date: { $gte: prevStart, $lte: prevEnd }
    });

    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const prevSpent = prevExpenses.reduce((s, e) => s + e.amount, 0);

    /* ===== Budget ===== */
    const budget = Number(req.user.salary) || 0;
    const remaining = budget - totalSpent;

    /* ===== Category Comparison ===== */
    const currentCat = {};
    const prevCat = {};

    expenses.forEach(e => {
      currentCat[e.category] = (currentCat[e.category] || 0) + e.amount;
    });

    prevExpenses.forEach(e => {
      prevCat[e.category] = (prevCat[e.category] || 0) + e.amount;
    });

    const categoryComparison = Object.keys({
      ...currentCat,
      ...prevCat
    }).map(cat => ({
      category: cat,
      current: currentCat[cat] || 0,
      previous: prevCat[cat] || 0,
      difference: (currentCat[cat] || 0) - (prevCat[cat] || 0)
    }));

    res.json({
      budget,
      totalSpent,
      prevSpent,
      remaining,
      difference: totalSpent - prevSpent,
      expenses,
      categoryComparison
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Report generation failed" });
  }
};
