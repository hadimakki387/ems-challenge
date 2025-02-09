import type { Employee } from "~/db/schema/employee";
import type { Timesheet } from "~/db/schema/timesheet";
export type EmployeeErrors = {
  [K in keyof Employee]?: string;
} & {
  server?: string[];
};

export interface GetEmployeeLoaderData {
  employee: Employee;
}

export interface GetAllEmployeesLoaderData {
  employees: Employee[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  sortField: string;
  sortOrder: "asc" | "desc";
  filterDepartment: string;
}

export interface ActionData<T> {
  errors?: T;
}

export interface EmployeeActionData extends ActionData<EmployeeErrors> {}
