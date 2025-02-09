// /src/views/EmployeeList/EmployeeTable.tsx
import { Link } from "react-router";

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  job_title: string;
}

interface EmployeeTableProps {
  employees: Employee[];
}

export default function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <div className="overflow-x-auto">
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
          {employees.length ? (
            employees.map((emp) => (
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
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-3 px-6 text-center">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
