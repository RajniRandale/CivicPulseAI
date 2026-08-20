require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("./db");

async function createOfficer() {
  try {

    // =========================
    // OFFICER DETAILS
    // =========================

    const name = "CivicPulse Officer";
    const email = "officer@civicpulseai.com";
    const password = "Officer@123";


    // =========================
    // CHECK EXISTING ACCOUNT
    // =========================

    const existingUser = await pool.query(
      "SELECT id, role FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {

      console.log("Officer account already exists.");

      console.log(
        "Role:",
        existingUser.rows[0].role
      );

      await pool.end();
      return;
    }


    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // =========================
    // CREATE OFFICER
    // =========================

    const result = await pool.query(
      `INSERT INTO users
      (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at`,
      [
        name,
        email,
        hashedPassword,
        "officer",
      ]
    );


    console.log(
      "================================="
    );

    console.log(
      "Officer created successfully!"
    );

    console.log(
      "ID:",
      result.rows[0].id
    );

    console.log(
      "Name:",
      result.rows[0].name
    );

    console.log(
      "Email:",
      result.rows[0].email
    );

    console.log(
      "Role:",
      result.rows[0].role
    );

    console.log(
      "Password: Officer@123"
    );

    console.log(
      "================================="
    );

  } catch (error) {

    console.error(
      "Error creating officer:",
      error
    );

  } finally {

    await pool.end();

  }
}

createOfficer();