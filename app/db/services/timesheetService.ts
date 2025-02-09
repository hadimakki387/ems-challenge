import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "..";
import { timesheetsTable } from "../schema/timesheet";

export interface GetTimesheetsParams {
  search?: string;
  employeeFilter?: string;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

export type Timesheet = Omit<typeof timesheetsTable.$inferSelect, "id">;

export class TimesheetService {
  // Get a single timesheet by ID
  async getTimesheetById(id: number): Promise<Timesheet | undefined> {
    const result = await db.query.timesheets.findMany({
      where: eq(timesheetsTable.id, id),
    });
    return result[0];
  }

  // Get filtered, sorted, and paginated timesheets from the database.
  async getTimesheets({
    search = "",
    employeeFilter = "",
    page = 1,
    pageSize = 10,
    sortField = "start_time",
    sortOrder = "asc",
  }: GetTimesheetsParams = {}): Promise<{
    timesheets: Timesheet[];
    total: number;
  }> {
    const offset = (page - 1) * pageSize;

    // Build the dynamic where clause.
    let whereClause: any = undefined;
    if (search && employeeFilter) {
      // Filter summary by search text and employee_id by employeeFilter (exact match)
      whereClause = and(
        like(timesheetsTable.summary, `%${search}%`),
        eq(timesheetsTable.employee_id, Number(employeeFilter))
      );
    } else if (search) {
      whereClause = like(timesheetsTable.summary, `%${search}%`);
    } else if (employeeFilter) {
      whereClause = eq(timesheetsTable.employee_id, Number(employeeFilter));
    }

    // Determine the column to sort by.
    let orderColumn;
    switch (sortField) {
      case "employee_id":
        orderColumn = timesheetsTable.employee_id;
        break;
      case "start_time":
        orderColumn = timesheetsTable.start_time;
        break;
      case "end_time":
        orderColumn = timesheetsTable.end_time;
        break;
      case "summary":
        orderColumn = timesheetsTable.summary;
        break;
      default:
        orderColumn = timesheetsTable.start_time;
    }

    const orderByClause =
      sortOrder === "asc" ? asc(orderColumn) : desc(orderColumn);

    // Get the filtered and paginated timesheets.
    const timesheets = await db
      .select()
      .from(timesheetsTable)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(offset);

    // Also retrieve the total count.
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(timesheetsTable)
      .where(whereClause);
    const total = countResult[0].count;

    return { timesheets, total };
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
