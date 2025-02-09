// db/employeeService.ts
import sqlite3 from "sqlite3";

export interface Employee {
  id?: number;
  name: string;
  email: string;
  phone: string;
  dob: string; // Use ISO date strings (YYYY-MM-DD)
  job_title: string;
  department: string;
  salary: number;
  start_date: string; // ISO date string
  end_date?: string; // ISO date string (nullable)
  photo_path?: string; // Optional file path for bonus photo feature
  documents?: string; // Optional JSON string for file paths or metadata
}

export class EmployeeService {
  private db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  // Get a single employee by ID
  getEmployeeById(id: number): Promise<Employee | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM employees WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row as Employee);
      });
    });
  }

  // Get all employees
  getAllEmployees(): Promise<Employee[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM employees`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows as Employee[]);
      });
    });
  }

  // Create a new employee
  createEmployee(employee: Employee): Promise<{ id: number }> {
    const {
      name,
      email,
      phone,
      dob,
      job_title,
      department,
      salary,
      start_date,
      end_date = null,
      photo_path = null,
      documents = null,
    } = employee;

    // check if the employee already exists
    const employeeExists = this.db.get(
      `SELECT * FROM employees WHERE email = ?`,
      [email]
    );

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO employees 
          (name, email, phone, dob, job_title, department, salary, start_date, end_date, photo_path, documents) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name,
          email,
          phone,
          dob,
          job_title,
          department,
          salary,
          start_date,
          end_date,
          photo_path,
          documents,
        ],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  }

  // Update an existing employee
  updateEmployee(id: number, employee: Employee): Promise<{ changes: number }> {
    const {
      name,
      email,
      phone,
      dob,
      job_title,
      department,
      salary,
      start_date,
      end_date = null,
      photo_path = null,
      documents = null,
    } = employee;

    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE employees 
         SET name = ?, email = ?, phone = ?, dob = ?, job_title = ?, department = ?, salary = ?, start_date = ?, end_date = ?, photo_path = ?, documents = ? 
         WHERE id = ?`,
        [
          name,
          email,
          phone,
          dob,
          job_title,
          department,
          salary,
          start_date,
          end_date,
          photo_path,
          documents,
          id,
        ],
        function (err) {
          if (err) return reject(err);
          resolve({ changes: this.changes });
        }
      );
    });
  }

  // Delete an employee by ID
  deleteEmployee(id: number): Promise<{ changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM employees WHERE id = ?`, [id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
}
