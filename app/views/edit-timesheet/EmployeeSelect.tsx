// /src/views/timesheets/EditTimesheetView/EmployeeSelect.tsx

import type { Employee } from "~/db/schema/employee";

interface EmployeeSelectProps {
  employees: Employee[];
  selectedEmployeeId: number;
  error?: string;
}

export default function EmployeeSelect({
  employees,
  selectedEmployeeId,
  error,
}: EmployeeSelectProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-700">Employee:</label>
      <select
        name="employee_id"
        defaultValue={selectedEmployeeId}
        className="border border-gray-300 rounded px-3 py-2"
      >
        <option value="">Select Employee</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
