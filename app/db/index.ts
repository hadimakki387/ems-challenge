// db/index.ts
import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import { fileURLToPath } from "url";

// Open the database connection (or create the DB file if it doesn’t exist)
export async function openDb() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const dbConfigPath = path.join(__dirname, "../../database.yaml");
  const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, "utf8")) as {
    sqlite_path: string;
  };

  const { sqlite_path: sqlitePath } = dbConfig;

  const db = new sqlite3.Database(sqlitePath);
  return db;
}
