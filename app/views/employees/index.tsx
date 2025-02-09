// /src/views/EmployeeList/index.tsx
import { Link } from "react-router";
import type { GetAllEmployeesLoaderData } from "~/interfaces/employee";
import EmployeeTable from "./EmployeeTable";
import Pagination from "./Pagination";
import SearchSortFilterForm from "./SearchSortFilterForm";

interface data {
  data: GetAllEmployeesLoaderData;
}
export default function EmployeeList(data: data) {
  const {
    data: {
      employees,
      total,
      page,
      pageSize,
      search,
      sortField,
      sortOrder,
      filterDepartment,
    },
  } = data;

  console.log(data);

  const totalPages = Math.ceil(total / pageSize);

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

      {/* Use the separated search/sort/filter form */}
      <SearchSortFilterForm
        search={search}
        sortField={sortField}
        sortOrder={sortOrder}
        filterDepartment={filterDepartment}
        pageSize={pageSize}
      />

      {/* Render the employee table */}
      <EmployeeTable employees={employees} />

      {/* Render pagination controls */}
      {employees.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          search={search}
          sortField={sortField}
          sortOrder={sortOrder}
          filterDepartment={filterDepartment}
          pageSize={pageSize}
        />
      )}
    </div>
  );
}
