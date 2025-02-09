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

// Updated employees array according to the schema
const employees = [
  {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    dob: "1990-01-01", // ISO date string (YYYY-MM-DD)
    job_title: "Manager",
    department: "HR",
    salary: 30000,
    start_date: "2020-01-01", // ISO date string
    end_date: null, // null if the employee is still active
    photo_path: null, // optional bonus field
    documents: null, // optional bonus field (can store JSON string or file paths)
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "0987654321",
    dob: "1985-05-15",
    job_title: "Developer",
    department: "Engineering",
    salary: 50000,
    start_date: "2019-03-15",
    end_date: null,
    photo_path: null,
    documents: null,
  },
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "5551234567",
    dob: "1992-08-21",
    job_title: "Designer",
    department: "Creative",
    salary: 40000,
    start_date: "2021-07-01",
    end_date: null,
    photo_path: null,
    documents: null,
  },
];

// Updated timesheets array according to the schema
const timesheets = [
  {
    employee_id: 1,
    start_time: "2025-02-10 08:00:00",
    end_time: "2025-02-10 17:00:00",
    summary: "Worked on project A",
  },
  {
    employee_id: 2,
    start_time: "2025-02-11 12:00:00",
    end_time: "2025-02-11 17:00:00",
    summary: "Bug fixes and code review",
  },
  {
    employee_id: 3,
    start_time: "2025-02-12 07:00:00",
    end_time: "2025-02-12 16:00:00",
    summary: "Design brainstorming",
  },
];

const insertData = (table, data) => {
  // Use the object keys as column names; ensure they match the schema exactly.
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
