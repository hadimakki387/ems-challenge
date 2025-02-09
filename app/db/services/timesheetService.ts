// db/timesheetService.ts
import { eq } from "drizzle-orm";
import { db } from "..";
import { timesheetsTable } from "../schema/timesheet";

export type Timesheet = Omit<typeof timesheetsTable.$inferSelect, "id">;
export class TimesheetService {
  // Get a single timesheet by ID
  async getTimesheetById(id: number): Promise<Timesheet | undefined> {
    const result = await db.query.timesheets.findMany({
      where: eq(timesheetsTable.id, id),
    });
    return result[0];
  }

  // Get all timesheets
  async getAllTimesheets(): Promise<Timesheet[]> {
    return await db.query.timesheets.findMany();
  }

  // Create a new timesheet
  async createTimesheet(timesheet: Timesheet): Promise<{ id: number }> {
    const result = db
      .insert(timesheetsTable)
      .values({
        employee_id: timesheet.employee_id,
        start_time: timesheet.start_time,
        end_time: timesheet.end_time,
        summary: timesheet.summary,
      })
      .run();
    return { id: result.lastInsertRowid as number };
  }

  // Update an existing timesheet
  async updateTimesheet(
    id: number,
    timesheet: Timesheet
  ): Promise<{ changes: number }> {
    const result = db
      .update(timesheetsTable)
      .set({
        employee_id: timesheet.employee_id,
        start_time: timesheet.start_time,
        end_time: timesheet.end_time,
        summary: timesheet.summary,
      })
      .where(eq(timesheetsTable.id, id))
      .run();
    return { changes: result.changes };
  }

  // Delete a timesheet by ID
  async deleteTimesheet(id: number): Promise<{ changes: number }> {
    const result = db
      .delete(timesheetsTable)
      .where(eq(timesheetsTable.id, id))
      .run();
    return { changes: result.changes };
  }
}
