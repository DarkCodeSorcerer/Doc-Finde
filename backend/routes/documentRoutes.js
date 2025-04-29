const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { getDocuments, getDocumentById, getDocumentsByVault, createDocument, updateDocument, deleteDocument } = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// API Routes
router.get("/", protect, getDocuments);
router.get("/vault/:vaultId", protect, getDocumentsByVault);
router.get("/:id", protect, getDocumentById);
router.post("/", protect, upload.single("file"), createDocument);
router.put("/:id", protect, updateDocument);
router.delete("/:id", protect, deleteDocument);

module.exports = router;
