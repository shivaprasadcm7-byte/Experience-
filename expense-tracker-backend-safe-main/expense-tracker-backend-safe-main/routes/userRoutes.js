const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getUserProfile,
    updateSalary,
    updateBudget
} = require("../controllers/userController");

router.use(protect);

router.get("/profile", getUserProfile);
router.put("/salary", updateSalary);
router.put("/budget", updateBudget);

module.exports = router;
