// db/employeeService.ts
import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "~/db/db.server";
import { employeesTable } from "../schema/employee";

export interface GetEmployeesParams {
  search?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  filterDepartment?: string;
  page?: number;
  pageSize?: number;
}

// employee with id excluded
export type Employee = Omit<typeof employeesTable.$inferSelect, "id">;

export class EmployeeService {
  // With Drizzle, you can use the shared db connection directly.
  async getEmployeeById(id: number): Promise<Employee | undefined> {
    const result = await db.query.employees.findMany({
      where: eq(employeesTable.id, id),
    });
    return result[0];
  }

  async getEmployees({
    search = "",
    sortField = "name",
    sortOrder = "asc",
    filterDepartment = "",
    page = 1,
    pageSize = 10,
  }: GetEmployeesParams = {}): Promise<{
    employees: Employee[];
    total: number;
  }> {
    // Calculate the offset for pagination.
    const offset = (page - 1) * pageSize;

    // Build a dynamic where clause only if filtering parameters are provided.
    let whereClause: any = undefined;
    if (search && filterDepartment) {
      whereClause = and(
        or(
          like(employeesTable.name, `%${search}%`),
          like(employeesTable.email, `%${search}%`)
        ),
        eq(employeesTable.department, filterDepartment)
      );
    } else if (search) {
      whereClause = or(
        like(employeesTable.name, `%${search}%`),
        like(employeesTable.email, `%${search}%`)
      );
    } else if (filterDepartment) {
      whereClause = eq(employeesTable.department, filterDepartment);
    }
    // If neither search nor filterDepartment is provided, whereClause remains undefined,
    // so the query returns all records.

    // Determine the column to sort by based on the provided sortField.
    let orderColumn;
    switch (sortField) {
      case "name":
        orderColumn = employeesTable.name;
        break;
      case "email":
        orderColumn = employeesTable.email;
        break;
      case "phone":
        orderColumn = employeesTable.phone;
        break;
      case "department":
        orderColumn = employeesTable.department;
        break;
      case "job_title":
        orderColumn = employeesTable.job_title;
        break;
      default:
        orderColumn = employeesTable.name;
    }

    // Create the orderBy clause.
    const orderByClause =
      sortOrder === "asc" ? asc(orderColumn) : desc(orderColumn);

    // Build the main query with filtering, sorting, and pagination.
    const employees = await db
      .select()
      .from(employeesTable)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(pageSize)
      .offset(offset);

    // For pagination, get the total count (applying the same filter conditions).
    const countResult = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(employeesTable)
      .where(whereClause);
    const total = countResult[0].count;

    return { employees, total };
  }

  async createEmployee(employee: Employee): Promise<{ id: number }> {
    const result = db.insert(employeesTable).values(employee).run();
    return { id: result.lastInsertRowid as number };
  }

  async updateEmployee(
    id: number,
    employee: Employee
  ): Promise<{ changes: number }> {
    const result = db
      .update(employeesTable)
      .set(employee)
      .where(eq(employeesTable.id, id))
      .run();
    return { changes: result.changes };
  }

  async deleteEmployee(id: number): Promise<{ changes: number }> {
    const result = db
      .delete(employeesTable)
      .where(eq(employeesTable.id, id))
      .run();
    return { changes: result.changes };
  }
}
