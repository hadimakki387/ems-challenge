// db/schema.ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const timesheetsTable = sqliteTable("timesheets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employee_id: integer("employee_id").notNull(),
  start_time: text("start_time").notNull(),
  end_time: text("end_time").notNull(),
  summary: text("summary"),
});

export type Timesheet = typeof timesheetsTable.$inferSelect;
