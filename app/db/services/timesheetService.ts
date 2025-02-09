// db/timesheetService.ts

import sqlite3 from "sqlite3";

export interface Timesheet {
  id?: number;
  employee_id: number;
  start_time: string; // Use ISO datetime strings (YYYY-MM-DDTHH:mm)
  end_time: string; // Use ISO datetime strings
  summary?: string;
}

export class TimesheetService {
  private db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  // Get a single timesheet by ID
  getTimesheetById(id: number): Promise<Timesheet | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(`SELECT * FROM timesheets WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row as Timesheet);
      });
    });
  }

  // Get all timesheets
  getAllTimesheets(): Promise<Timesheet[]> {
    return new Promise((resolve, reject) => {
      this.db.all(`SELECT * FROM timesheets`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows as Timesheet[]);
      });
    });
  }

  // Create a new timesheet
  createTimesheet(timesheet: Timesheet): Promise<{ id: number }> {
    const { employee_id, start_time, end_time, summary = null } = timesheet;
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT INTO timesheets 
         (employee_id, start_time, end_time, summary) 
         VALUES (?, ?, ?, ?)`,
        [employee_id, start_time, end_time, summary],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  }

  // Update an existing timesheet
  updateTimesheet(
    id: number,
    timesheet: Timesheet
  ): Promise<{ changes: number }> {
    const { employee_id, start_time, end_time, summary = null } = timesheet;
    return new Promise((resolve, reject) => {
      this.db.run(
        `UPDATE timesheets 
         SET employee_id = ?, start_time = ?, end_time = ?, summary = ? 
         WHERE id = ?`,
        [employee_id, start_time, end_time, summary, id],
        function (err) {
          if (err) return reject(err);
          resolve({ changes: this.changes });
        }
      );
    });
  }

  // Delete a timesheet by ID
  deleteTimesheet(id: number): Promise<{ changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(`DELETE FROM timesheets WHERE id = ?`, [id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  }
}

// Example of initializing the TimesheetService:
// (async () => {
//   const db = await openDb();
//   const timesheetService = new TimesheetService(db);
//   // Use timesheetService.getAllTimesheets(), etc.
// })();
