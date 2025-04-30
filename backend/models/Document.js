const mongoose = require("mongoose");
//new line

const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vaultId: { type: mongoose.Schema.Types.ObjectId, ref: "Vault", required: true },
  title: { type: String, required: true },
  content: { type: String },
  fileUrl: { type: String, required: true },
  tags: { type: [String], default: [] },
  metadata: {
    author: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadDate: { type: Date, default: Date.now },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", DocumentSchema);
