const Vault = require("../models/Vault");
const Notification = require("../models/Notification");

// 1️⃣ Request a Vault (User Side)
exports.requestVault = async (req, res) => {
  try {
    const { userId, vaultName, documentLimit } = req.body;

    if (!userId || !vaultName || !documentLimit) {
      return res.status(400).json({ error: "Vault name and document limit are required" });
    }

    if (documentLimit < 1 || documentLimit > 10) {
      return res.status(400).json({ error: "Document limit must be between 1 and 10" });
    }

    // Create new Vault request
    const newVault = new Vault({
      user: userId,
      vaultName,
      status: "Processing",  
      documentLimit,        
    });

    await newVault.save();

    // Create a notification for the admin
    const notification = new Notification({
      user: userId,
      message: `User with ID ${userId} has requested a vault named ${vaultName}.`,
      link: "/admin/vault-requests",
      vaultName: req.body.vaultName,
    });

    await notification.save();

    res.status(201).json({ message: "Vault request submitted successfully" });
  } catch (error) {
    console.error("Error in requestVault:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// 2️⃣ Get User Vaults
exports.getUserVaults = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const vaults = await Vault.find({ user: userId }).select("-__v"); // Exclude version key
    res.json(vaults);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 3️⃣ Get All Pending Vault Requests (Admin Side)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Vault.find({ status: "Processing" })
      .populate("user", "name email")
      .select("vaultName status documentLimit");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 4️⃣ Approve Vault Request
exports.approveVault = async (req, res) => {
  try {
    const { vaultId } = req.params; 
    const vault = await Vault.findById(vaultId);
    if (!vault) {
      return res.status(404).json({ error: "Vault request not found" });
    }

    vault.status = "Active"; 
    await vault.save();

    // ✅ Notify the user about approval
    const notification = new Notification({
      user: vault.user,
      message: `Your vault request "${vault.vaultName}" has been approved.`,
      vaultName: vault.vaultName,
    });
    await notification.save();

    res.json({ message: "Vault approved successfully" });
  } catch (error) {
    console.error("Error approving vault:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.denyVault = async (req, res) => {
  try {
    const { vaultId } = req.params; 
    const { reason } = req.body;

    const vault = await Vault.findById(vaultId);
    if (!vault) {
      return res.status(404).json({ message: "Vault request not found" });
    }

    vault.status = "Denied";
    vault.reason = reason;
    await vault.save();

    // ✅ Notify the user about denial
    const notification = new Notification({
      user: vault.user,
      message: `Your vault request "${vault.vaultName}" has been denied. Reason: ${reason}`,
      vaultName: vault.vaultName,
    });
    await notification.save();

    res.json({ message: "Vault request denied", reason });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 6️⃣ Upload Document to Vault
exports.uploadDocument = async (req, res) => {
  try {
    const { vaultId } = req.params;
    const { documentUrl } = req.body;

    const vault = await Vault.findById(vaultId);
    if (!vault) {
      return res.status(404).json({ message: "Vault not found" });
    }

    if (vault.documents.length >= vault.documentLimit) {
      return res.status(400).json({ message: `Vault limit reached (${vault.documentLimit} documents max)` });
    }

    vault.documents.push(documentUrl); // ✅ Corrected push operation
    await vault.save();

    res.json({ message: "Document uploaded successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

