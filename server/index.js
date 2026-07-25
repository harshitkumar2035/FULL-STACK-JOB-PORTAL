const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "Full Stack Job Portal Server is running smoothly!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Full Stack Job Portal API",
    version: "1.0.0",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobportal";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Warning:", err.message);
    console.log("⚠️ Running server with fallbacks or local MongoDB requirement.");
  });

app.listen(PORT, () => {
  console.log("\n=============================================");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🏥 Health Check : http://localhost:${PORT}/api/health`);
  console.log(`💼 Jobs API     : http://localhost:${PORT}/api/jobs`);
  console.log("=============================================\n");
});