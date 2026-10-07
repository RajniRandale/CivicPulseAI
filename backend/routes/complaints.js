const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const pool = require("../db");
const {
  analyzeComplaint,
  createDuplicateGroupLabel,
  findDuplicateMatches,
} = require("../utils/complaintAi");

const router = express.Router();

const complaintUploadDirectory = path.join(
  __dirname,
  "..",
  "uploads",
  "complaints"
);

fs.mkdirSync(complaintUploadDirectory, { recursive: true });

const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

const complaintImageUpload = multer({
  storage: multer.diskStorage({
    destination: complaintUploadDirectory,
    filename: (req, file, callback) => {
      const extension = allowedImageTypes.get(file.mimetype);
      callback(
        null,
        `complaint-${Date.now()}-${crypto.randomUUID()}${extension}`
      );
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      return callback(
        new Error("Only JPEG, PNG, WebP, and GIF complaint images are supported")
      );
    }
    return callback(null, true);
  },
});

const parseComplaintImage = (req, res, next) => {
  complaintImageUpload.single("image")(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      return res.status(status).json({
        message:
          error.code === "LIMIT_FILE_SIZE"
            ? "Complaint image must be 5 MB or smaller"
            : error.message,
      });
    }

    return res.status(400).json({
      message: error.message || "Invalid complaint image",
    });
  });
};

const removeUploadedImage = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Failed to remove unreferenced complaint image:", error);
    }
  }
};


// ==================================================
// AUTHENTICATION MIDDLEWARE
// ==================================================

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


// ==================================================
// STAFF AUTHENTICATION MIDDLEWARE
// ==================================================

const authenticateOfficer = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (
    !["officer", "admin"].includes(
      req.user.role
    )
  ) {
    return res.status(403).json({
      message: "Officer or admin access required",
    });
  }

  if (req.user.role === "admin") {
    return next();
  }

  try {
    const result = await pool.query(
      "SELECT department FROM officer_users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "Officer account was not found",
      });
    }

    req.user.department = result.rows[0].department;
    return next();
  } catch (error) {
    console.error("Officer department lookup error:", error);
    return res.status(500).json({
      message: "Failed to verify officer department",
    });
  }
};


// ==================================================
// AI-ASSISTED COMPLAINT ANALYSIS
// ==================================================

router.post(
  "/analyze",
  authenticateToken,
  async (req, res) => {
    const { description, location, latitude, longitude } = req.body;

    if (
      typeof description !== "string" ||
      description.trim().length < 3
    ) {
      return res.status(400).json({
        message: "Complaint description must contain at least 3 characters",
      });
    }

    try {
      const prediction = await analyzeComplaint(description.trim());
      const department = prediction.department;
      const result = await pool.query(
        `SELECT id, category, department, description, location, latitude, longitude, status
         FROM complaints
         WHERE department = $1
           AND LOWER(COALESCE(status, 'pending')) NOT IN ('resolved', 'rejected')
         ORDER BY created_at DESC
         LIMIT 1000`,
        [department]
      );

      return res.json({
        categoryPrediction: {
          category: prediction.category,
          confidence: prediction.categoryConfidence,
        },
        departmentPrediction: department,
        priorityPrediction: prediction.priority,
        priorityConfidence: prediction.priorityConfidence,
        possibleDuplicates: findDuplicateMatches(
          {
            category: prediction.category,
            department,
            description: description.trim(),
            location,
            latitude,
            longitude,
          },
          result.rows
        ),
      });
    } catch (error) {
      console.error("Complaint AI analysis error:", error);

      return res.status(500).json({
        message: "Failed to analyze complaint",
      });
    }
  }
);


// ==================================================
// CREATE COMPLAINT - CITIZEN
// ==================================================

router.post(
  "/",
  authenticateToken,
  parseComplaintImage,
  async (req, res) => {
    let uploadedFilePath = req.file?.path;
    try {

      const {
        description,
        location,
        latitude,
        longitude,
      } = req.body;


      // ==================================================
      // VALIDATION
      // ==================================================

      if (
        typeof description !== "string" ||
        !description.trim()
      ) {
        await removeUploadedImage(uploadedFilePath);
        return res.status(400).json({
          message:
            "Complaint description is required",
        });
      }

      if (typeof location !== "string" || !location.trim()) {
        await removeUploadedImage(uploadedFilePath);
        return res.status(400).json({
          message:
            "Complaint location is required",
        });
      }


      // ==================================================
      // AUTOMATIC TITLE
      // ==================================================

      const cleanDescription =
        description.trim();

      if (cleanDescription.length < 3) {
        await removeUploadedImage(uploadedFilePath);
        return res.status(400).json({
          message: "Complaint description must contain at least 3 characters",
        });
      }

      if (cleanDescription.length > 5000) {
        await removeUploadedImage(uploadedFilePath);
        return res.status(400).json({
          message: "Complaint description cannot exceed 5000 characters",
        });
      }

      if (
        (latitude != null &&
          (!Number.isFinite(Number(latitude)) ||
            Number(latitude) < -90 ||
            Number(latitude) > 90)) ||
        (longitude != null &&
          (!Number.isFinite(Number(longitude)) ||
            Number(longitude) < -180 ||
            Number(longitude) > 180))
      ) {
        await removeUploadedImage(uploadedFilePath);
        return res.status(400).json({
          message: "Complaint coordinates are invalid",
        });
      }

      const autoTitle =
        cleanDescription.length > 50
          ? cleanDescription.substring(0, 50) + "..."
          : cleanDescription;

      const prediction = await analyzeComplaint(cleanDescription);
      const client = await pool.connect();
      let complaint;
      let relatedComplaints = [];

      try {
        await client.query("BEGIN");
        await client.query(
          "SELECT pg_advisory_xact_lock(hashtext($1))",
          [`${prediction.department}:${prediction.category}`]
        );

        const existingResult = await client.query(
          `SELECT id, title, category, department, description, location,
                  latitude, longitude, status, duplicate_group_id,
                  duplicate_group_label
           FROM complaints
           WHERE category = $1
             AND department = $2
             AND LOWER(COALESCE(status, 'pending')) NOT IN ('resolved', 'rejected')
           ORDER BY created_at ASC
           LIMIT 1000
           FOR UPDATE`,
          [prediction.category, prediction.department]
        );

        relatedComplaints = findDuplicateMatches(
          {
            category: prediction.category,
            department: prediction.department,
            description: cleanDescription,
            location: location.trim(),
            latitude,
            longitude,
          },
          existingResult.rows
        );

        const insertResult = await client.query(
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
            image,
            status,
            priority,
            category_confidence,
            priority_confidence
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING *`,
          [
            req.user.id,
            autoTitle,
            prediction.category,
            prediction.department,
            cleanDescription,
            location.trim(),
            latitude ?? null,
            longitude ?? null,
            req.file
              ? `/uploads/complaints/${req.file.filename}`
              : null,
            "Pending",
            prediction.priority,
            prediction.categoryConfidence,
            prediction.priorityConfidence,
          ]
        );

        complaint = insertResult.rows[0];

        if (relatedComplaints.length > 0) {
          const matchingIds = [
            ...new Set(relatedComplaints.map((match) => match.id)),
          ];
          const matchingGroupIds = [
            ...new Set(relatedComplaints.map((match) => match.duplicateGroupId)),
          ];
          const rootComplaintId = Math.min(...matchingGroupIds);
          const matchingGroup = existingResult.rows.find(
            (row) => row.id === rootComplaintId
          );
          const groupLabel =
            matchingGroup?.duplicate_group_label ||
            createDuplicateGroupLabel(prediction.category, location);

          await client.query(
            `UPDATE complaints
             SET duplicate_group_id = $1,
                 duplicate_group_label = $2
             WHERE id = ANY($3::integer[])
                OR duplicate_group_id = ANY($4::integer[])`,
            [rootComplaintId, groupLabel, matchingIds, matchingGroupIds]
          );

          const groupedComplaint = await client.query(
            `UPDATE complaints
             SET duplicate_group_id = $1,
                 duplicate_group_label = $2
             WHERE id = $3
             RETURNING *`,
            [rootComplaintId, groupLabel, complaint.id]
          );
          complaint = groupedComplaint.rows[0];
        }

        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }

      return res.status(201).json({
        message: "Complaint submitted successfully",
        complaint,
        relatedComplaints,
      });

    } catch (error) {
      await removeUploadedImage(uploadedFilePath);

      // IMPORTANT:
      // Show actual PostgreSQL error
      console.error(
        "===================================="
      );

      console.error(
        "COMPLAINT SUBMISSION ERROR"
      );

      console.error(
        "Message:",
        error.message
      );

      console.error(
        "Code:",
        error.code
      );

      console.error(
        "Detail:",
        error.detail
      );

      console.error(
        "===================================="
      );


      return res.status(500).json({
        message:
          error.code === "42P01" || error.code === "42703"
            ? "Complaint AI database migration is required"
            : "Failed to submit complaint",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  }
);


// ==================================================
// GET LOGGED-IN CITIZEN COMPLAINTS
// ==================================================

router.get(
  "/my",
  authenticateToken,
  async (req, res) => {
    try {

      const result =
        await pool.query(
          `SELECT *
           FROM complaints
           WHERE user_id = $1
           ORDER BY created_at DESC`,
          [req.user.id]
        );


      return res.json({
        complaints:
          result.rows,
      });

    } catch (error) {

      console.error(
        "Fetch complaints error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch complaints",
      });
    }
  }
);


// ==================================================
// GET OTHER CITIZENS' COMPLAINTS
// ==================================================

router.get(
  "/nearby",
  authenticateToken,
  async (req, res) => {
    try {

      const result =
        await pool.query(
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
        complaints:
          result.rows,
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


// ==================================================
// PUBLIC PROJECT STATISTICS
// ==================================================

router.get(
  "/stats",
  async (req, res) => {
    try {

      const result =
        await pool.query(
          `SELECT
             (
               SELECT COUNT(*)::int
               FROM complaints
               WHERE LOWER(status) = 'resolved'
             ) AS resolved_count,

             (
               SELECT COUNT(*)::int
               FROM citizen_users
             ) AS active_citizens`
        );


      return res.json({

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

      return res.status(500).json({
        message:
          "Failed to fetch complaint statistics",
      });
    }
  }
);


// ==================================================
// GET ALL COMPLAINTS - OFFICER / ADMIN
// ==================================================

router.get(
  "/all",
  authenticateToken,
  authenticateOfficer,
  async (req, res) => {
    try {

      const result = await pool.query(
        `SELECT
           c.*,
           CASE
             WHEN c.duplicate_group_id IS NULL THEN 0
             ELSE (
               SELECT COUNT(*)::int
               FROM complaints grouped
               WHERE grouped.duplicate_group_id = c.duplicate_group_id
             )
           END AS related_complaint_count,
           COALESCE(cu.name, u.name) AS citizen_name,
           COALESCE(cu.email, u.email) AS citizen_email
         FROM complaints c
         LEFT JOIN citizen_users cu ON c.user_id = cu.id
         LEFT JOIN users u ON c.user_id = u.id
         WHERE ($1::boolean OR c.department = $2)
         ORDER BY
           CASE COALESCE(c.priority, 'Low')
             WHEN 'Critical' THEN 0
             WHEN 'High' THEN 1
             WHEN 'Medium' THEN 2
             ELSE 3
           END,
           CASE LOWER(COALESCE(c.status, 'pending'))
             WHEN 'pending' THEN 0
             WHEN 'in progress' THEN 1
             ELSE 2
           END,
           c.created_at ASC`,
        [req.user.role === "admin", req.user.department || null]
      );


      return res.json({
        complaints:
          result.rows,
      });

    } catch (error) {

      console.error(
        "Officer fetch complaints error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch complaints",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  }
);


// ==================================================
// GET RELATED COMPLAINTS IN A DUPLICATE GROUP
// OFFICER / ADMIN ONLY
// ==================================================

router.get(
  "/:id/related",
  authenticateToken,
  authenticateOfficer,
  async (req, res) => {
    try {
      const result = await pool.query(
        `WITH target AS (
           SELECT id, department, COALESCE(duplicate_group_id, id) AS group_id
           FROM complaints
           WHERE id = $1
             AND ($2::boolean OR department = $3)
         )
         SELECT
           c.*,
           COALESCE(cu.name, u.name) AS citizen_name,
           COALESCE(cu.email, u.email) AS citizen_email
         FROM target t
         JOIN complaints c
           ON c.id = t.group_id
           OR c.duplicate_group_id = t.group_id
         LEFT JOIN citizen_users cu ON c.user_id = cu.id
         LEFT JOIN users u ON c.user_id = u.id
         ORDER BY c.created_at ASC`,
        [req.params.id, req.user.role === "admin", req.user.department || null]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Complaint not found",
        });
      }

      const complaints =
        result.rows.length > 1 ? result.rows : [];
      return res.json({
        groupLabel: complaints[0]?.duplicate_group_label || null,
        complaints,
      });
    } catch (error) {
      console.error("Related complaint lookup error:", error);
      return res.status(500).json({
        message: "Failed to fetch related complaints",
      });
    }
  }
);


// ==================================================
// UPDATE COMPLAINT STATUS
// OFFICER / ADMIN ONLY
// ==================================================

router.put(
  "/:id/status",
  authenticateToken,
  authenticateOfficer,
  async (req, res) => {

    try {

      const { id } = req.params;

      const { status } = req.body;


      // ==================================================
      // ALLOWED STATUS VALUES
      // ==================================================

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


      // ==================================================
      // UPDATE DATABASE
      // ==================================================

      const result = await pool.query(
        `UPDATE complaints
         SET status = $1
         WHERE id = $2
           AND ($3::boolean OR department = $4)
         RETURNING *`,
        [status, id, req.user.role === "admin", req.user.department || null]
      );

      // ==================================================
      // COMPLAINT NOT FOUND
      // ==================================================

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Complaint not found",
        });
      }


      // ==================================================
      // SUCCESS
      // ==================================================

      return res.json({
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

      return res.status(500).json({
        message:
          "Failed to update complaint status",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,
      });
    }
  }
);


// ==================================================
// EXPORT ROUTER
// ==================================================

module.exports = router;