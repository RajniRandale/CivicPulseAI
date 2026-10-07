require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const otpRoutes = require("./routes/otp");
const complaintRoutes = require("./routes/complaints");
const newsRoutes = require("./routes/newsRoutes");

const pool = require("./db");

const app = express();

// ==================================================
// MIDDLEWARE
// ==================================================

// CORS MUST BE BEFORE ALL API ROUTES
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON requests
app.use(express.json());

// Serve complaint images from their stored /uploads/... paths
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    index: false,
    dotfiles: "deny",
  })
);

// ==================================================
// API ROUTES
// ==================================================

app.use("/api/auth", authRoutes);

app.use("/api/otp", otpRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/news", newsRoutes);

// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {
  res.status(200).send("CivicPulseAI Backend is running!");
});

// ==================================================
// DATABASE TEST
// ==================================================

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      message: "Database connected successfully!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// ==================================================
// 404 ROUTE
// ==================================================

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ==================================================
// ERROR HANDLER
// ==================================================

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  res.status(500).json({
    message: "Internal server error",
  });
});

// ==================================================
// SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});