// db/employeeService.ts
import { eq } from "drizzle-orm";
import { db } from "..";
import { employeesTable } from "../schema/employee";

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

  async getAllEmployees(): Promise<Employee[]> {
    return await db.query.employees.findMany();
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
