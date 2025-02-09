// scripts/seed.js
import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, "../database.yaml");
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, "utf8"));
const { sqlite_path: sqlitePath } = dbConfig;

const db = new sqlite3.Database(sqlitePath);

// Allowed departments and sample job titles (adjust as needed)
const departments = ["Engineering", "Sales", "Marketing", "HR"];
const jobTitles = [
  "Manager",
  "Developer",
  "Designer",
  "Salesperson",
  "Marketer",
];

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];

// Generate 20 employee records
const employees = [];
for (let i = 1; i <= 20; i++) {
  const randomDept =
    departments[Math.floor(Math.random() * departments.length)];
  const randomJob = jobTitles[Math.floor(Math.random() * jobTitles.length)];
  employees.push({
    name: `Employee ${i}`,
    email: `employee${i}@example.com`,
    // Generate a phone number with enough digits (example: 555 followed by a 7-digit number)
    phone: `555${i.toString().padStart(7, "0")}`,
    dob: "1990-01-01", // Fixed date; you can randomize if needed
    job_title: randomJob,
    department: randomDept,
    salary: 30000 + i * 1000,
    start_date: "2020-01-01",
    end_date: null,
    photo_path: null,
    documents: null,
    job_type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
  });
}

// Generate 20 timesheet records (one per employee)
const timesheets = [];
for (let i = 1; i <= 20; i++) {
  // Use a date that increments for each timesheet entry (February 2025)
  const date = new Date(2025, 1, 10 + i); // Note: month is 0-indexed; 1 means February.
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const start_time = `${year}-${month}-${day} 08:00:00`;
  const end_time = `${year}-${month}-${day} 17:00:00`;
  timesheets.push({
    employee_id: i, // Assumes employee IDs 1 through 20 exist
    start_time,
    end_time,
    summary: `Worked on project ${i}`,
  });
}

// Helper function to insert data into a table.
const insertData = (table, data) => {
  const columns = Object.keys(data[0]).join(", ");
  const placeholders = Object.keys(data[0])
    .map(() => "?")
    .join(", ");
  const insertStmt = db.prepare(
    `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`
  );

  data.forEach((row) => {
    insertStmt.run(Object.values(row));
  });

  insertStmt.finalize();
};

db.serialize(() => {
  insertData("employees", employees);
  insertData("timesheets", timesheets);
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Database seeded successfully.");
  }
});

export { departments, jobTitles, jobTypes };
