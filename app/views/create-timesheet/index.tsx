// app/routes/timesheets.new.tsx
import { Form } from "react-router";
import TextInput from "~/components/TextInput";
import type { Employee } from "~/db/schema/employee";
import type { TimeSheetActionData } from "~/interfaces/timesheet";

// Main component that composes the form with inline subcomponents.
export default function NewTimesheetForm({
  actionData,
  employees,
}: {
  actionData: TimeSheetActionData;
  employees: Employee[];
}) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Timesheet</h1>
      <Form method="post" className="space-y-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Start Time:</label>
          <input
            type="datetime-local"
            name="startTime"
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.start_time && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.start_time}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">End Time:</label>
          <input
            type="datetime-local"
            name="endTime"
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.end_time && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.end_time}
            </p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Employee:</label>
          <select
            name="employeeId"
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select an employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
          {actionData?.errors?.employee_id && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.employee_id}
            </p>
          )}
        </div>
        <TextInput
          label="Summary"
          name="summary"
          error={actionData?.errors?.summary ? actionData.errors.summary : ""}
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Timesheet
        </button>
      </Form>
      <div className="mt-4">
        <button
          onClick={() => (window.location.href = "/timesheets")}
          className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back to Timesheets List
        </button>
      </div>
    </div>
  );
}
