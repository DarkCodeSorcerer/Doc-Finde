const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
    vaultName: { type: String, required: true },
  },
  { timestamps: true }
);
//new line

module.exports = mongoose.model("Notification", notificationSchema);
