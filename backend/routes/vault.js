const express = require("express");
const {
  requestVault,
  getUserVaults,
  getAllRequests,
  approveVault,
  denyVault,
  uploadDocument
} = require("../controllers/vaultController");

const router = express.Router();

// Middleware to parse JSON request bodies
router.use(express.json());

/* ------------------- USER ROUTES ------------------- */

// Request a vault (User)
router.post("/request", async (req, res) => {
  try {
    const { userId, vaultName, documentLimit } = req.body;

    if (!userId || !vaultName || !documentLimit) {
      return res.status(400).json({ error: "Vault name and document limit are required" });
    }

    if (documentLimit < 1 || documentLimit > 10) {
      return res.status(400).json({ error: "Document limit must be between 1 and 10" });
    }

    await requestVault(req, res);
  } catch (error) {
    console.error("Vault request error:", error);
    res.status(500).json({ error: "Server error while requesting vault" });
  }
});

// Get vaults for a specific user
router.get("/user/:userId", getUserVaults);

// Upload a document to a vault
router.post("/:vaultId/upload", uploadDocument);

/* ------------------- ADMIN ROUTES ------------------- */

// Fetch all pending vault requests (Admin)
router.get("/requests/all", getAllRequests);  // Updated to /requests/all

// Approve a vault request (Admin)
router.put("/:vaultId/approve", approveVault);

// Deny a vault request with a reason (Admin)
router.put("/:vaultId/deny", denyVault);

module.exports = router;
