// app/routes/employees._index.tsx
import { useState } from "react";
import { openDb } from "~/db";
import { EmployeeService } from "~/db/services/employeeService";
import { z } from "zod";
import { Link, useLoaderData } from "react-router";

// Define a Zod schema for an employee
const employeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  department: z.string(),
  job_title: z.string(),
});

// Define an array schema for employees
const employeesSchema = z.array(employeeSchema);

export let loader = async () => {
  const db = await openDb();
  const employeeService = new EmployeeService(db);
  const employees = await employeeService.getAllEmployees();
  // Validate the data using Zod
  const validatedEmployees = employeesSchema.parse(employees);
  return { employees: validatedEmployees };
};

export default function EmployeeList() {
  const { employees } = useLoaderData() as { employees: any[] };
  const [search, setSearch] = useState("");
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">Employees</h1>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/employees/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add New Employee
        </Link>
        <Link
          to="/timesheets"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          View Timesheets
        </Link>
      </div>
      <div className="overflow-x-auto">
        <input
          type="text"
          placeholder="Search employees"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Department</th>
              <th className="py-3 px-6 text-left">Job Title</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredEmployees.map((emp) => (
              <tr
                key={emp.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">
                  <Link
                    to={`/employees/${emp.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {emp.name}
                  </Link>
                </td>
                <td className="py-3 px-6 text-left">{emp.email}</td>
                <td className="py-3 px-6 text-left">{emp.phone}</td>
                <td className="py-3 px-6 text-left">{emp.department}</td>
                <td className="py-3 px-6 text-left">{emp.job_title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
