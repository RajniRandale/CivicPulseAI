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

    console.error(
      "Token verification error:",
      error
    );

    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};


// =====================================
// STAFF AUTHENTICATION MIDDLEWARE
// =====================================

const authenticateOfficer = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (!["officer", "admin"].includes(req.user.role)) {
    return res.status(403).json({
      message: "Officer or admin access required",
    });
  }

  next();
};


// =====================================
// DEPARTMENT MAPPING
// =====================================

const departmentMap = {

  "Garbage & Waste Management":
    "Sanitation Department",

  "Road Damage / Potholes":
    "Road Department",

  "Street Light":
    "Electrical Department",

  "Drainage & Sewerage":
    "Drainage Department",

  "Water Supply":
    "Water Department",

  "Other":
    "General Civic Department",

};


// =====================================
// CREATE COMPLAINT - CITIZEN
// =====================================

router.post("/", authenticateToken, async (req, res) => {

  try {

    const {
      category,
      description,
      location,
      latitude,
      longitude,
      image,
    } = req.body;


    // =====================================
    // VALIDATION
    // =====================================

    if (
      !category ||
      !description ||
      !location
    ) {

      return res.status(400).json({
        message:
          "Category, description and location are required",
      });
    }


    // =====================================
    // AUTOMATIC TITLE
    // =====================================

    const autoTitle =
      description.trim().length > 50
        ? description.trim().substring(0, 50)
        : description.trim();


    // =====================================
    // AUTOMATIC DEPARTMENT ASSIGNMENT
    // =====================================

    const assignedDepartment =
      departmentMap[category] ||
      "General Civic Department";


    console.log(
      "Complaint Category:",
      category
    );

    console.log(
      "Assigned Department:",
      assignedDepartment
    );


    // =====================================
    // INSERT COMPLAINT
    // =====================================

    const result = await pool.query(
      `INSERT INTO complaints
      (
        user_id,
        title,
        category,
        department,
        description,
        location,
        latitude,
        longitude,
        image
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        req.user.id,
        autoTitle,
        category,
        assignedDepartment,
        description.trim(),
        location.trim(),
        latitude || null,
        longitude || null,
        image || null,
      ]
    );


    // =====================================
    // SUCCESS
    // =====================================

    res.status(201).json({

      message:
        "Complaint submitted successfully",

      complaint:
        result.rows[0],

    });

  } catch (error) {

    console.error(
      "Complaint submission error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to submit complaint",
    });
  }
});


// =====================================
// GET LOGGED-IN CITIZEN COMPLAINTS
// =====================================

router.get(
  "/my",
  authenticateToken,
  async (req, res) => {

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

      console.error(
        "Fetch complaints error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch complaints",
      });
    }
  }
);


// =====================================
// GET OTHER CITIZENS' COMPLAINTS
// =====================================

router.get(
  "/nearby",
  authenticateToken,
  async (req, res) => {

    try {

      const result = await pool.query(
        `SELECT
           id,
           title,
           category,
           department,
           description,
           location,
           latitude,
           longitude,
           status,
           created_at
         FROM complaints
         WHERE user_id <> $1
         ORDER BY created_at DESC`,
        [req.user.id]
      );


      return res.json({
        complaints: result.rows,
      });

    } catch (error) {

      console.error(
        "Fetch nearby complaints error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch nearby complaints",
      });
    }
  }
);


// =====================================
// PUBLIC PROJECT STATISTICS
// =====================================

router.get(
  "/stats",
  async (req, res) => {

    try {

      const result = await pool.query(
        `SELECT
           (
             SELECT COUNT(*)::int
             FROM complaints
             WHERE status = 'Resolved'
           ) AS resolved_count,

           (
             SELECT COUNT(*)::int
             FROM citizen_users
           ) AS active_citizens`
      );


      res.json({

        resolvedComplaints:
          result.rows[0]?.resolved_count || 0,

        activeCitizens:
          result.rows[0]?.active_citizens || 0,

      });

    } catch (error) {

      console.error(
        "Fetch complaint statistics error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch complaint statistics",
      });
    }
  }
);


// =====================================
// GET ALL COMPLAINTS - OFFICER / ADMIN
// =====================================

router.get(
  "/all",
  authenticateToken,
  authenticateOfficer,
  async (req, res) => {

    try {

      const result = await pool.query(
        `SELECT
          c.*,
          u.name AS citizen_name,
          u.email AS citizen_email
         FROM complaints c
         LEFT JOIN users u
         ON c.user_id = u.id
         ORDER BY c.created_at DESC`
      );


      res.json({
        complaints: result.rows,
      });

    } catch (error) {

      console.error(
        "Officer fetch complaints error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch complaints",
      });
    }
  }
);


// =====================================
// UPDATE COMPLAINT STATUS
// OFFICER / ADMIN ONLY
// =====================================

router.put(
  "/:id/status",
  authenticateToken,
  authenticateOfficer,
  async (req, res) => {

    try {

      const {
        id,
      } = req.params;

      const {
        status,
      } = req.body;


      // =====================================
      // ALLOWED STATUS VALUES
      // =====================================

      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Resolved",
        "Rejected",
      ];


      if (!status) {

        return res.status(400).json({
          message:
            "Status is required",
        });
      }


      if (
        !allowedStatuses.includes(status)
      ) {

        return res.status(400).json({
          message:
            "Invalid status. Use Pending, In Progress, Resolved or Rejected.",
        });
      }


      // =====================================
      // UPDATE DATABASE
      // =====================================

      const result = await pool.query(
        `UPDATE complaints
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [
          status,
          id,
        ]
      );


      // =====================================
      // COMPLAINT NOT FOUND
      // =====================================

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({
          message:
            "Complaint not found",
        });
      }


      // =====================================
      // SUCCESS
      // =====================================

      res.json({

        message:
          "Complaint status updated successfully",

        complaint:
          result.rows[0],

      });

    } catch (error) {

      console.error(
        "Complaint status update error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update complaint status",
      });
    }
  }
);


module.exports = router;