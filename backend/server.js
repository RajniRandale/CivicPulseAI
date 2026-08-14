require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");

const pool = require("./db");

const app = express();


// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());

app.use(express.json());


// ==================================================
// API ROUTES
// ==================================================

app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);


// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {
  res.send("CivicPulseAI Backend is running!");
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
// SERVER
// ==================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});