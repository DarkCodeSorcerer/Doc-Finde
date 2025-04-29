const mongoose = require("mongoose");

const VaultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vaultName: { type: String, required: true },
  status: {
    type: String,
    enum: ["Processing", "Active", "Denied"],
    default: "Processing",
  },
  reason: { type: String, default: "" }, // If denied, store reason
  documents: [{ type: String }],
  documentLimit: { type: Number, required: true, min: 1, max: 10 },
}, { timestamps: true });

module.exports = mongoose.model("Vault", VaultSchema);
