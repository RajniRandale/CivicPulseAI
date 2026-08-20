const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const pool = require("../db");

const {
  generateOTP,
  getOTPExpiry,
  isOTPExpired,
} = require("../utils/otp");

const router = express.Router();


// ==================================================
// GMAIL TRANSPORTER
// ==================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});


// ==================================================
// REGISTER CITIZEN
// EMAIL VERIFICATION REQUIRED
// MOBILE VERIFICATION NOT REQUIRED
// ==================================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      password,
    } = req.body;

    // =========================
    // REQUIRED FIELDS
    // =========================

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        message:
          "Name, email, mobile and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const normalizedMobile =
      mobile.trim();

    // =========================
    // EMAIL FORMAT
    // =========================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message:
          "Enter a valid email address",
      });
    }

    // =========================
    // MOBILE FORMAT
    // =========================

    if (!/^\d{10}$/.test(normalizedMobile)) {
      return res.status(400).json({
        message:
          "Mobile number must contain exactly 10 digits",
      });
    }

    // =========================
    // EXISTING EMAIL
    // =========================

    const existingEmail =
      await pool.query(
        `SELECT id
         FROM users
         WHERE LOWER(email) = $1`,
        [normalizedEmail]
      );

    if (existingEmail.rows.length > 0) {
      return res.status(409).json({
        message:
          "Email already registered",
      });
    }

    // =========================
    // EXISTING MOBILE
    // =========================

    const existingMobile =
      await pool.query(
        `SELECT id
         FROM users
         WHERE mobile = $1`,
        [normalizedMobile]
      );

    if (existingMobile.rows.length > 0) {
      return res.status(409).json({
        message:
          "Mobile number already registered",
      });
    }

    // ==================================================
    // EMAIL VERIFICATION REQUIRED
    // ==================================================

    const emailVerification =
      await pool.query(
        `SELECT id
         FROM otp_verifications
         WHERE email = $1
           AND email_verified = TRUE
         ORDER BY created_at DESC
         LIMIT 1`,
        [normalizedEmail]
      );

    if (emailVerification.rows.length === 0) {
      return res.status(400).json({
        message:
          "Please verify your email first.",
      });
    }

    // ==================================================
    // HASH PASSWORD
    // ==================================================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // ==================================================
    // CREATE CITIZEN
    // ==================================================

    const result =
      await pool.query(
        `INSERT INTO users
        (
          name,
          email,
          mobile,
          password,
          role
        )
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING
          id,
          name,
          email,
          mobile,
          role,
          created_at`,
        [
          name.trim(),
          normalizedEmail,
          normalizedMobile,
          hashedPassword,
          "citizen",
        ]
      );

    // ==================================================
    // DELETE USED REGISTRATION OTP
    // ==================================================

    await pool.query(
      `DELETE FROM otp_verifications
       WHERE email = $1`,
      [normalizedEmail]
    );

    // ==================================================
    // SUCCESS
    // ==================================================

    return res.status(201).json({
      message:
        "Registration successful",

      user:
        result.rows[0],
    });

  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      message:
        "Server error during registration",
    });
  }
});


// ==================================================
// CITIZEN LOGIN
// EMAIL ONLY
// PASSWORD + EMAIL OTP
// ==================================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // =========================
    // REQUIRED
    // =========================

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // =========================
    // EMAIL FORMAT
    // =========================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message:
          "Enter a valid email address",
      });
    }

    // =========================
    // FIND CITIZEN
    // =========================

    const result =
      await pool.query(
        `SELECT *
         FROM users
         WHERE LOWER(email) = $1
           AND role = 'citizen'`,
        [normalizedEmail]
      );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message:
          "Citizen account not found",
      });
    }

    const user =
      result.rows[0];

    // =========================
    // PASSWORD CHECK
    // =========================

    const passwordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordValid) {
      return res.status(401).json({
        message:
          "Invalid email or password",
      });
    }

    // ==================================================
    // GENERATE LOGIN OTP
    // ==================================================

    const loginOTP =
      generateOTP();

    const expiresAt =
      getOTPExpiry();

    // ==================================================
    // DELETE OLD LOGIN OTP
    // ==================================================

    await pool.query(
      `DELETE FROM login_otp_verifications
       WHERE user_id = $1`,
      [user.id]
    );

    // ==================================================
    // SAVE LOGIN OTP
    // ==================================================

    await pool.query(
      `INSERT INTO login_otp_verifications
      (
        user_id,
        email,
        otp,
        expires_at
      )
      VALUES
      ($1, $2, $3, $4)`,
      [
        user.id,
        user.email,
        loginOTP,
        expiresAt,
      ]
    );

    // ==================================================
    // SEND LOGIN OTP TO GMAIL
    // ==================================================

    await transporter.sendMail({
      from:
        `"CivicPulse AI" <${process.env.GMAIL_USER}>`,

      to:
        normalizedEmail,

      subject:
        "CivicPulse AI - Login Verification OTP",

      text:
        `Your CivicPulse AI login OTP is ${loginOTP}. ` +
        `This OTP is valid for 10 minutes. ` +
        `Do not share this OTP with anyone.`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: auto;
          padding: 25px;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">

          <h2 style="color:#0d6efd;">
            CivicPulse AI
          </h2>

          <p>
            Your login verification OTP is:
          </p>

          <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            text-align:center;
            padding:15px;
            background:#f4f8ff;
            border-radius:8px;
            margin:20px 0;
          ">
            ${loginOTP}
          </div>

          <p>
            This OTP is valid for
            <strong>10 minutes</strong>.
          </p>

          <p>
            Do not share this OTP with anyone.
          </p>

          <hr>

          <small>
            CivicPulse AI
          </small>

        </div>
      `,
    });

    return res.status(200).json({
      message:
        "Password verified. OTP sent to your email.",

      otpSent: true,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "Citizen login error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to send login OTP.",
    });
  }
});


// ==================================================
// VERIFY LOGIN EMAIL OTP
// ==================================================

router.post(
  "/verify-login-otp",
  async (req, res) => {
    try {

      const {
        email,
        otp,
      } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          message:
            "Email and OTP are required",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      // =========================
      // FIND USER
      // =========================

      const userResult =
        await pool.query(
          `SELECT *
           FROM users
           WHERE LOWER(email) = $1
             AND role = 'citizen'`,
          [normalizedEmail]
        );

      if (userResult.rows.length === 0) {
        return res.status(401).json({
          message:
            "Citizen account not found",
        });
      }

      const user =
        userResult.rows[0];

      // =========================
      // FIND OTP
      // =========================

      const otpResult =
        await pool.query(
          `SELECT *
           FROM login_otp_verifications
           WHERE user_id = $1
           ORDER BY created_at DESC
           LIMIT 1`,
          [user.id]
        );

      if (otpResult.rows.length === 0) {
        return res.status(400).json({
          message:
            "OTP not found. Please login again.",
        });
      }

      const verification =
        otpResult.rows[0];

      // =========================
      // EXPIRY
      // =========================

      if (
        isOTPExpired(
          verification.expires_at
        )
      ) {

        await pool.query(
          `DELETE FROM login_otp_verifications
           WHERE id = $1`,
          [verification.id]
        );

        return res.status(400).json({
          message:
            "OTP has expired. Please login again.",
        });
      }

      // =========================
      // CHECK OTP
      // =========================

      if (
        verification.otp !==
        otp.toString()
      ) {
        return res.status(400).json({
          message:
            "Invalid OTP",
        });
      }

      // =========================
      // JWT SECRET
      // =========================

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          message:
            "JWT_SECRET is not configured",
        });
      }

      // =========================
      // CREATE TOKEN
      // =========================

      const token =
        jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d",
          }
        );

      // =========================
      // DELETE USED OTP
      // =========================

      await pool.query(
        `DELETE FROM login_otp_verifications
         WHERE id = $1`,
        [verification.id]
      );

      // =========================
      // SUCCESS
      // =========================

      return res.status(200).json({
        message:
          "Login successful",

        token,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
        },
      });

    } catch (error) {

      console.error(
        "Verify login OTP error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error while verifying login OTP",
      });
    }
  }
);


// ==================================================
// FORGOT PASSWORD - SEND OTP
// ==================================================

router.post(
  "/forgot-password/send-otp",
  async (req, res) => {
    try {

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message:
            "Email is required",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      // =========================
      // CHECK EMAIL
      // =========================

      const result =
        await pool.query(
          `SELECT id, name, email
           FROM users
           WHERE LOWER(email) = $1
             AND role = 'citizen'`,
          [normalizedEmail]
        );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message:
            "No citizen account found with this email.",
        });
      }

      const user =
        result.rows[0];

      // =========================
      // GENERATE RESET OTP
      // =========================

      const resetOTP =
        generateOTP();

      const expiresAt =
        getOTPExpiry();

      // =========================
      // DELETE OLD RESET OTP
      // =========================

      await pool.query(
        `DELETE FROM password_reset_otp
         WHERE user_id = $1`,
        [user.id]
      );

      // =========================
      // SAVE RESET OTP
      // =========================

      await pool.query(
        `INSERT INTO password_reset_otp
        (
          user_id,
          email,
          otp,
          expires_at,
          verified
        )
        VALUES
        ($1, $2, $3, $4, FALSE)`,
        [
          user.id,
          normalizedEmail,
          resetOTP,
          expiresAt,
        ]
      );

      // =========================
      // SEND RESET OTP
      // =========================

      await transporter.sendMail({
        from:
          `"CivicPulse AI" <${process.env.GMAIL_USER}>`,

        to:
          normalizedEmail,

        subject:
          "CivicPulse AI - Password Reset OTP",

        text:
          `Your CivicPulse AI password reset OTP is ${resetOTP}. ` +
          `This OTP is valid for 10 minutes. ` +
          `Do not share this OTP with anyone.`,

        html: `
          <div style="
            font-family:Arial,sans-serif;
            max-width:500px;
            margin:auto;
            padding:25px;
            border:1px solid #ddd;
            border-radius:10px;
          ">

            <h2 style="color:#0d6efd;">
              CivicPulse AI
            </h2>

            <p>
              Hello ${user.name || "Citizen"},
            </p>

            <p>
              Your password reset OTP is:
            </p>

            <div style="
              font-size:32px;
              font-weight:bold;
              letter-spacing:8px;
              text-align:center;
              padding:15px;
              background:#f4f8ff;
              border-radius:8px;
              margin:20px 0;
            ">
              ${resetOTP}
            </div>

            <p>
              This OTP is valid for
              <strong>10 minutes</strong>.
            </p>

            <p>
              Do not share this OTP with anyone.
            </p>

            <hr>

            <small>
              CivicPulse AI
            </small>

          </div>
        `,
      });

      return res.status(200).json({
        message:
          "Password reset OTP sent to your email.",
        otpSent: true,
      });

    } catch (error) {

      console.error(
        "Forgot password send OTP error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to send password reset OTP.",
      });
    }
  }
);


// ==================================================
// FORGOT PASSWORD - VERIFY OTP
// ==================================================

router.post(
  "/forgot-password/verify-otp",
  async (req, res) => {
    try {

      const {
        email,
        otp,
      } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          message:
            "Email and OTP are required",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      // =========================
      // FIND OTP
      // =========================

      const result =
        await pool.query(
          `SELECT *
           FROM password_reset_otp
           WHERE LOWER(email) = $1
           ORDER BY created_at DESC
           LIMIT 1`,
          [normalizedEmail]
        );

      if (result.rows.length === 0) {
        return res.status(400).json({
          message:
            "OTP not found. Please request a new OTP.",
        });
      }

      const verification =
        result.rows[0];

      // =========================
      // CHECK EXPIRY
      // =========================

      if (
        isOTPExpired(
          verification.expires_at
        )
      ) {

        await pool.query(
          `DELETE FROM password_reset_otp
           WHERE id = $1`,
          [verification.id]
        );

        return res.status(400).json({
          message:
            "OTP has expired. Please request a new OTP.",
        });
      }

      // =========================
      // CHECK OTP
      // =========================

      if (
        verification.otp !==
        otp.toString()
      ) {
        return res.status(400).json({
          message:
            "Invalid OTP",
        });
      }

      // =========================
      // MARK VERIFIED
      // =========================

      await pool.query(
        `UPDATE password_reset_otp
         SET verified = TRUE
         WHERE id = $1`,
        [verification.id]
      );

      return res.status(200).json({
        message:
          "OTP verified successfully",
        verified: true,
      });

    } catch (error) {

      console.error(
        "Forgot password verify OTP error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to verify password reset OTP.",
      });
    }
  }
);


// ==================================================
// FORGOT PASSWORD - RESET PASSWORD
// ==================================================

router.post(
  "/forgot-password/reset",
  async (req, res) => {
    try {

      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message:
            "Email and new password are required",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      // =========================
      // FIND VERIFIED OTP
      // =========================

      const otpResult =
        await pool.query(
          `SELECT *
           FROM password_reset_otp
           WHERE LOWER(email) = $1
             AND verified = TRUE
           ORDER BY created_at DESC
           LIMIT 1`,
          [normalizedEmail]
        );

      if (otpResult.rows.length === 0) {
        return res.status(400).json({
          message:
            "Please verify the OTP first.",
        });
      }

      const verification =
        otpResult.rows[0];

      // =========================
      // CHECK EXPIRY AGAIN
      // =========================

      if (
        isOTPExpired(
          verification.expires_at
        )
      ) {

        await pool.query(
          `DELETE FROM password_reset_otp
           WHERE id = $1`,
          [verification.id]
        );

        return res.status(400).json({
          message:
            "Password reset session has expired. Please request a new OTP.",
        });
      }

      // =========================
      // PASSWORD VALIDATION
      // =========================

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (
        !passwordRegex.test(password)
      ) {
        return res.status(400).json({
          message:
            "Password must contain uppercase, lowercase, number, special character and be at least 8 characters.",
        });
      }

      // =========================
      // HASH NEW PASSWORD
      // =========================

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // =========================
      // UPDATE PASSWORD
      // =========================

      const updateResult =
        await pool.query(
          `UPDATE users
           SET password = $1
           WHERE id = $2
             AND role = 'citizen'
           RETURNING
             id,
             name,
             email,
             mobile,
             role`,
          [
            hashedPassword,
            verification.user_id,
          ]
        );

      if (
        updateResult.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Citizen account not found.",
        });
      }

      // =========================
      // DELETE USED RESET OTP
      // =========================

      await pool.query(
        `DELETE FROM password_reset_otp
         WHERE id = $1`,
        [verification.id]
      );

      return res.status(200).json({
        message:
          "Password reset successfully.",
      });

    } catch (error) {

      console.error(
        "Password reset error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to reset password.",
      });
    }
  }
);


// ==================================================
// EXPORT
// ==================================================

module.exports = router;