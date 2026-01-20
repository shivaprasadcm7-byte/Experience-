const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMonthlyReport } = require("../controllers/reportController");

router.use(protect);

router.get("/monthly", getMonthlyReport);

module.exports = router;
