-- ./app/db/schema.sql

-- Create the employees table
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,  -- Ensures no duplicate email addresses
    phone TEXT NOT NULL,
    dob DATE NOT NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    salary REAL NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,               -- Nullable in case the employee is still active
    photo_path TEXT,             -- Optional bonus field for storing the path to the employee's photo
    documents TEXT,               -- Optional bonus field for storing file paths or JSON for documents (e.g., CV, ID)
    job_type TEXT NOT NULL
);

-- Create the timesheets table
CREATE TABLE IF NOT EXISTS timesheets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    
    employee_id INTEGER NOT NULL,  -- Foreign key to the employees table
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    summary TEXT,                  -- Optional field for a work summary
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);
