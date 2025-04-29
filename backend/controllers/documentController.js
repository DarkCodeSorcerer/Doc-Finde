const Document = require("../models/Document");
const Vault = require("../models/Vault");

// Get all documents
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents", error });
  }
};

// Get documents by Vault ID
const getDocumentsByVault = async (req, res) => {
  try {
    const { vaultId } = req.params;
    const documents = await Document.find({ vaultId });

    if (!documents.length) {
      return res.status(404).json({ message: "No documents found for this vault" });
    }

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching documents", error });
  }
};

// Get a single document by ID
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: "Document not found" });
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: "Error fetching document", error });
  }
};

// Upload Document
const createDocument = async (req, res) => {
  try {
    const { title, content, tags, metadata, vaultId } = req.body;

    if (!vaultId) return res.status(400).json({ message: "Vault ID is required" });

    const vault = await Vault.findById(vaultId);
    if (!vault) return res.status(404).json({ message: "Vault not found" });

    const documentCount = await Document.countDocuments({ vaultId });
    if (documentCount >= vault.documentLimit) {
      return res.status(400).json({ message: "Document limit reached for this vault" });
    }

    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    let parsedMetadata = {};

    try {
      parsedMetadata = metadata ? JSON.parse(metadata) : {};
    } catch (error) {
      return res.status(400).json({ message: "Invalid metadata format" });
    }

    const newDocument = new Document({
      userId: req.user._id,
      vaultId,
      title,
      content,
      fileUrl,
      tags: tags ? tags.split(",") : [],
      metadata: parsedMetadata,
    });

    await newDocument.save();
    res.status(201).json({ message: "Document uploaded successfully", document: newDocument });
  } catch (error) {
    res.status(500).json({ message: "Error uploading document", error });
  }
};

// Update Document
const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, tags, content, fileUrl } = req.body;

    const updateFields = {};
    if (title) updateFields.title = title;
    
    // Fix for tags: check if it's an array or string
    if (Array.isArray(tags)) {
      updateFields.tags = tags.map((t) => t.trim());
    } else if (typeof tags === "string") {
      updateFields.tags = tags.split(",").map((t) => t.trim());
    }

    if (content) updateFields.content = content;
    if (fileUrl) updateFields.fileUrl = fileUrl;

    const updatedDocument = await Document.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document updated successfully", document: updatedDocument });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Error updating document", error });
  }
};

// Delete Document
const deleteDocument = async (req, res) => {
  try {
    console.log("Deleting Document ID:", req.params.id); // 🟢 Log the ID

    const deletedDocument = await Document.findByIdAndDelete(req.params.id);
    if (!deletedDocument) return res.status(404).json({ message: "Document not found" });

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Error deleting document", error });
  }
};


module.exports = { getDocuments, getDocumentById, getDocumentsByVault, createDocument, updateDocument, deleteDocument };
