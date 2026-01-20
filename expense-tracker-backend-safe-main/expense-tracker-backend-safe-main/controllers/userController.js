const User = require("../models/user");

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🟢 Manually convert User document to POJO
        const userObj = user.toObject();

        // 🟢 Explicitly convert budgets Map to plain object for proper JSON serialization
        if (user.budgets && user.budgets instanceof Map) {
            userObj.budgets = Object.fromEntries(user.budgets);
        } else if (!userObj.budgets) {
            // Ensure budgets is at least an empty object if undefined
            userObj.budgets = {};
        }

        res.json(userObj);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update user salary
// @route   PUT /api/user/salary
// @access  Private
exports.updateSalary = async (req, res) => {
    try {
        const { salary } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.salary = salary;
        await user.save();

        res.json({ salary: user.salary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Update category budget
// @route   PUT /api/user/budget
// @access  Private
exports.updateBudget = async (req, res) => {
    try {
        const { category, limit } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Set budget for category (Map)
        if (!user.budgets) {
            user.budgets = {};
        }
        user.budgets.set(category, limit);

        await user.save();

        res.json(user.budgets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
