const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect, admin } = require("../middleware/authMiddleware"); // ✅ Import middlewares

// ✅ Fetch all unread notifications (Admin only)
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const notifications = await Notification.find({ isRead: false })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Mark notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await Notification.find({ user: userId, isRead: false }) // ✅ Filter only unread
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
});


module.exports = router;
