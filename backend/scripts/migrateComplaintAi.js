require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("../db");

const migrationPath = path.join(
  __dirname,
  "..",
  "migrations",
  "001_complaint_ai.sql"
);

const applyMigration = async () => {
  const migration = fs.readFileSync(migrationPath, "utf8");
  await pool.query(migration);
  console.log("Complaint AI database migration applied.");
};

applyMigration()
  .catch((error) => {
    console.error("Complaint AI database migration failed:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
