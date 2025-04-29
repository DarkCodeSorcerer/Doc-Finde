const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/userModel");

const router = express.Router();

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Get User Profile (Protected Route)
router.get("/profile", protect, getUserProfile);

router.get("/", async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const { isAdmin } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { isAdmin },
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Error updating user role", error });
    }
  });

module.exports = router;
