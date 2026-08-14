const express = require("express");
const jwt = require("jsonwebtoken");

const pool = require("../db");

const router = express.Router();

// =====================================
// AUTHENTICATION MIDDLEWARE
// =====================================

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication token is required",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid authentication token",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Token verification error:", error);

    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

// =====================================
// CREATE COMPLAINT
// =====================================

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      location,
      latitude,
      longitude,
      image,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!title || !category || !description || !location) {
      return res.status(400).json({
        message:
          "Title, category, description and location are required",
      });
    }

    // -----------------------------
    // INSERT COMPLAINT
    // -----------------------------

    const result = await pool.query(
      `INSERT INTO complaints
      (
        user_id,
        title,
        category,
        description,
        location,
        latitude,
        longitude,
        image
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        req.user.id,
        title.trim(),
        category,
        description.trim(),
        location.trim(),
        latitude || null,
        longitude || null,
        image || null,
      ]
    );

    // -----------------------------
    // SUCCESS RESPONSE
    // -----------------------------

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: result.rows[0],
    });

  } catch (error) {
    console.error("Complaint submission error:", error);

    res.status(500).json({
      message: "Failed to submit complaint",
    });
  }
});

// =====================================
// GET LOGGED-IN CITIZEN COMPLAINTS
// =====================================

router.get("/my", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM complaints
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      complaints: result.rows,
    });

  } catch (error) {
    console.error("Fetch complaints error:", error);

    res.status(500).json({
      message: "Failed to fetch complaints",
    });
  }
});

module.exports = router;