// db/schema.ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const employeesTable = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  dob: text("dob").notNull(), // stored as ISO date string
  job_title: text("job_title").notNull(),
  department: text("department").notNull(),
  salary: real("salary").notNull(),
  start_date: text("start_date").notNull(),
  end_date: text("end_date"),
  photo_path: text("photo_path"),
  documents: text("documents"),
});

export type Employee = typeof employeesTable.$inferSelect;
