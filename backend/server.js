require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const vaultRoutes = require("./routes/vault");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 // Serve uploaded files

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Import Routes
const documentRoutes = require("./routes/documentRoutes");

// Use Routes
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vaults", vaultRoutes);
app.use("/api/notifications", notificationRoutes);


// Simple Route
app.get("/", (req, res) => {
  res.send("Document Management System API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
