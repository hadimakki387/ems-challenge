import { useLoaderData } from "react-router";
import { EmployeeService } from "~/db/services/employeeService";
import EmployeeList from "~/views/employees";
import { z } from "zod";
import type { GetAllEmployeesLoaderData } from "~/interfaces/employee";
// Define a Zod enum for Departments.
const DepartmentEnum = z.enum(["Engineering", "Sales", "Marketing", "HR"]);

// Update the employee schema to use the enum.
const employeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  department: DepartmentEnum,
  job_title: z.string(),
});
const employeesSchema = z.array(employeeSchema);

export let loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);

  const search = url.searchParams.get("search") || "";
  const sortField = url.searchParams.get("sortField") || "name";
  const sortOrder =
    (url.searchParams.get("sortOrder") as "asc" | "desc") || "asc";
  const filterDepartment = url.searchParams.get("filterDepartment") || "";
  const page = Number(url.searchParams.get("page") || "1");
  const pageSize = Number(url.searchParams.get("pageSize") || "10");

  const employeeService = new EmployeeService();
  const { employees, total } = await employeeService.getEmployees({
    search,
    sortField,
    sortOrder,
    filterDepartment,
    page,
    pageSize,
  });

  const validatedEmployees = employeesSchema.parse(employees);

  return {
    employees: validatedEmployees,
    total,
    page,
    pageSize,
    search,
    sortField,
    sortOrder,
    filterDepartment,
  };
};
export default function Index() {
  const data = useLoaderData<GetAllEmployeesLoaderData>();
  return <EmployeeList data={data} />;
}
