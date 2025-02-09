// db/index.ts
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { employeesTable } from "./schema/employee";
import { timesheetsTable } from "./schema/timesheet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, "../../database.yaml");
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, "utf8")) as {
  sqlite_path: string;
};

const { sqlite_path: sqlitePath } = dbConfig;

const sqliteDb = new Database(sqlitePath); // using better-sqlite3
export const db = drizzle(sqliteDb, {
  schema: {
    employees: employeesTable,
    timesheets: timesheetsTable,
  },
});
