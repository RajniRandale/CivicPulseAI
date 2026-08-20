const express = require("express");
const pool = require("../db");
const nodemailer = require("nodemailer");

const {
  generateOTP,
  getOTPExpiry,
  isOTPExpired,
} = require("../utils/otp");

const router = express.Router();


// ==================================================
// GMAIL CONFIGURATION
// ==================================================

const emailTransporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});


// ==================================================
// CHECK GMAIL CONNECTION
// ==================================================

emailTransporter.verify((error) => {
  if (error) {
    console.error(
      "Gmail configuration error:",
      error.message
    );
  } else {
    console.log(
      "Gmail transporter is ready"
    );
  }
});


// ==================================================
// SEND EMAIL OTP
// ==================================================

router.post("/send-email-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // Check email format
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message:
          "Enter a valid email address",
      });
    }

    // Check existing user
    const existingUser =
      await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [normalizedEmail]
      );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message:
          "Email already registered",
      });
    }

    // Generate OTP
    const emailOTP =
      generateOTP();

    // OTP expiry
    const expiresAt =
      getOTPExpiry();

    // Delete previous OTP
    await pool.query(
      `DELETE FROM otp_verifications
       WHERE email = $1`,
      [normalizedEmail]
    );

    // Save OTP
    await pool.query(
      `INSERT INTO otp_verifications
      (
        email,
        email_otp,
        email_verified,
        expires_at
      )
      VALUES ($1, $2, $3, $4)`,
      [
        normalizedEmail,
        emailOTP,
        false,
        expiresAt,
      ]
    );

    // ==================================================
    // SEND OTP TO ACTUAL EMAIL
    // ==================================================

    await emailTransporter.sendMail({
      from: `"CivicPulse AI" <${process.env.GMAIL_USER}>`,

      to: normalizedEmail,

      subject:
        "CivicPulse AI - Email Verification OTP",

      text:
        `Your CivicPulse AI verification OTP is ${emailOTP}. ` +
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
            Hello,
          </p>

          <p>
            Your email verification OTP is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            padding: 15px;
            background: #f4f8ff;
            border-radius: 8px;
            margin: 20px 0;
          ">
            ${emailOTP}
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

    console.log(
      `Email OTP sent successfully to ${normalizedEmail}`
    );

    return res.status(200).json({
      message:
        "OTP sent successfully to your email",

      email: normalizedEmail,

      otpSent: true,
    });

  } catch (error) {

    console.error(
      "Send email OTP error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to send email OTP. Please check Gmail configuration.",
    });
  }
});


// ==================================================
// VERIFY EMAIL OTP
// ==================================================

router.post(
  "/verify-email-otp",
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

      const result =
        await pool.query(
          `SELECT *
           FROM otp_verifications
           WHERE email = $1
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

      // Check expiry
      if (
        isOTPExpired(
          verification.expires_at
        )
      ) {
        return res.status(400).json({
          message:
            "OTP has expired. Please request a new OTP.",
        });
      }

      // Check OTP
      if (
        verification.email_otp !==
        otp.toString()
      ) {
        return res.status(400).json({
          message:
            "Invalid OTP",
        });
      }

      // Mark verified
      await pool.query(
        `UPDATE otp_verifications
         SET email_verified = TRUE
         WHERE id = $1`,
        [verification.id]
      );

      return res.status(200).json({
        message:
          "Email verified successfully",

        verified: true,
      });

    } catch (error) {

      console.error(
        "Verify email OTP error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to verify email OTP",
      });
    }
  }
);


// ==================================================
// SEND MOBILE OTP
// ==================================================
// NOTE:
// Actual SMS provider is not connected yet.
// This currently generates and stores OTP.
// ==================================================

router.post(
  "/send-mobile-otp",
  async (req, res) => {
    try {

      const { mobile } = req.body;

      if (!mobile) {
        return res.status(400).json({
          message:
            "Mobile number is required",
        });
      }

      const normalizedMobile =
        mobile.trim();

      if (
        !/^\d{10}$/.test(
          normalizedMobile
        )
      ) {
        return res.status(400).json({
          message:
            "Mobile number must contain exactly 10 digits",
        });
      }

      // Check existing mobile
      const existingUser =
        await pool.query(
          "SELECT id FROM users WHERE mobile = $1",
          [normalizedMobile]
        );

      if (
        existingUser.rows.length > 0
      ) {
        return res.status(409).json({
          message:
            "Mobile number already registered",
        });
      }

      // Generate OTP
      const mobileOTP =
        generateOTP();

      const expiresAt =
        getOTPExpiry();

      // Delete old OTP
      await pool.query(
        `DELETE FROM otp_verifications
         WHERE mobile = $1`,
        [normalizedMobile]
      );

      // Save OTP
      await pool.query(
        `INSERT INTO otp_verifications
        (
          mobile,
          mobile_otp,
          mobile_verified,
          expires_at
        )
        VALUES ($1, $2, $3, $4)`,
        [
          normalizedMobile,
          mobileOTP,
          false,
          expiresAt,
        ]
      );

      // Temporary testing
      console.log(
        `Mobile OTP for ${normalizedMobile}: ${mobileOTP}`
      );

      return res.status(200).json({
        message:
          "Mobile OTP generated successfully",

        otpSent: true,

        // Temporary testing
        otp: mobileOTP,
      });

    } catch (error) {

      console.error(
        "Send mobile OTP error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to send mobile OTP",
      });
    }
  }
);


// ==================================================
// VERIFY MOBILE OTP
// ==================================================

router.post(
  "/verify-mobile-otp",
  async (req, res) => {
    try {

      const {
        mobile,
        otp,
      } = req.body;

      if (!mobile || !otp) {
        return res.status(400).json({
          message:
            "Mobile number and OTP are required",
        });
      }

      const normalizedMobile =
        mobile.trim();

      const result =
        await pool.query(
          `SELECT *
           FROM otp_verifications
           WHERE mobile = $1
           ORDER BY created_at DESC
           LIMIT 1`,
          [normalizedMobile]
        );

      if (result.rows.length === 0) {
        return res.status(400).json({
          message:
            "OTP not found. Please request a new OTP.",
        });
      }

      const verification =
        result.rows[0];

      // Check expiry
      if (
        isOTPExpired(
          verification.expires_at
        )
      ) {
        return res.status(400).json({
          message:
            "OTP has expired. Please request a new OTP.",
        });
      }

      // Check OTP
      if (
        verification.mobile_otp !==
        otp.toString()
      ) {
        return res.status(400).json({
          message:
            "Invalid OTP",
        });
      }

      // Mark verified
      await pool.query(
        `UPDATE otp_verifications
         SET mobile_verified = TRUE
         WHERE id = $1`,
        [verification.id]
      );

      return res.status(200).json({
        message:
          "Mobile number verified successfully",

        verified: true,
      });

    } catch (error) {

      console.error(
        "Verify mobile OTP error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to verify mobile OTP",
      });
    }
  }
);


// ==================================================
// EXPORT
// ==================================================

module.exports = router;