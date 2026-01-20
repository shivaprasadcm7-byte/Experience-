const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();
const { getSmartInsights } = require("../controllers/insightController");

router.use(protect);

router.get("/", getSmartInsights);

module.exports = router;