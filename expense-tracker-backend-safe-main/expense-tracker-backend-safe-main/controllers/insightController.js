const Expense = require("../models/Expense");

exports.getSmartInsights = async (req, res) => {
  try {
    const now = new Date();

    // Current month
    const startCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
    const endCurrent = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Previous month
    const startPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endPrev = new Date(now.getFullYear(), now.getMonth(), 0);

    const currentExpenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startCurrent, $lte: endCurrent }
    });

    const prevExpenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startPrev, $lte: endPrev }
    });

    // Summarize total and category-wise spending
    const summarize = (expenses) => {
      let total = 0;
      const categories = {};
      expenses.forEach((e) => {
        total += e.amount;
        categories[e.category] = (categories[e.category] || 0) + e.amount;
      });
      return { total, categories };
    };

    const current = summarize(currentExpenses);
    const previous = summarize(prevExpenses);

    let messages = [];
    let popupMessages = [];

    // Collect all unique categories (current + previous)
    const allCategories = new Set([
      ...Object.keys(current.categories),
      ...Object.keys(previous.categories)
    ]);

    allCategories.forEach((cat) => {
      const curr = current.categories[cat] || 0;
      const prev = previous.categories[cat] || 0;
      let msg = "";

      if (prev === 0 && curr === 0) {
        msg = `${cat}: no spending this month.`;
      } else if (prev === 0) {
        msg = `${cat}: spending started this month ₹${curr.toFixed(0)}. Keep control.`;
      } else {
        const percentChange = ((curr - prev) / prev) * 100;

        if (percentChange > 40) {
          msg = `${cat}: spending increased by ${percentChange.toFixed(0)}%. Be careful.`;
        } else if (percentChange > 15) {
          msg = `${cat}: spending increased by ${percentChange.toFixed(0)}%. Keep control.`;
        } else if (percentChange < -15) {
          msg = `${cat}: spending decreased by ${Math.abs(percentChange.toFixed(0))}%. Very good.`;
        } else {
          msg = `${cat}: spending stable at ₹${curr.toFixed(0)}. Good job.`;
        }
      }

      messages.push(msg);
      popupMessages.push(msg);
    });

    // Overall monthly comparison
    if (previous.total > 0) {
      const overallPercent = ((current.total - previous.total) / previous.total) * 100;
      let overallMsg = "";
      if (overallPercent > 20) {
        overallMsg = `Overall expenses increased by ${overallPercent.toFixed(0)}%. Be careful.`;
      } else if (overallPercent > 5) {
        overallMsg = `Overall expenses increased by ${overallPercent.toFixed(0)}%. Keep control.`;
      } else if (overallPercent < -5) {
        overallMsg = `Overall expenses decreased by ${Math.abs(overallPercent.toFixed(0))}%. Very good.`;
      } else {
        overallMsg = `Overall expenses stable compared to last month. Good job.`;
      }
      messages.push(overallMsg);
      popupMessages.push(overallMsg);
    }

    res.json({
      status: "info",
      currentMonthTotal: current.total,
      previousMonthTotal: previous.total,
      messages,
      popupMessages
    });
  } catch (err) {
    console.error("INSIGHT ERROR:", err);
    res.status(500).json({ error: "Failed to generate insights" });
  }
};
