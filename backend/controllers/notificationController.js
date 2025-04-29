const Notification = require("../models/notificationModel");

// Get all unread notifications
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params; // ✅ Get userId from request params

    const notifications = await Notification.find({ user: userId, isRead: false }) // ✅ Filter by user
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true; // ✅ Fixed field name
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};
