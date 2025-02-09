// app/routes/timesheets.new.tsx
import { Form, redirect, useActionData, useLoaderData } from "react-router";
import { json } from "utils/json";
import { z } from "zod";
import { EmployeeService } from "~/db/services/employeeService";
import { TimesheetService } from "~/db/services/timesheetService";

// Define a Zod schema for the timesheet form.
const timesheetSchema = z
  .object({
    start_time: z.string().min(1, { message: "Start time is required" }),
    end_time: z.string().min(1, { message: "End time is required" }),
    employee_id: z
      .string()
      .min(1, { message: "Employee selection is required" }),
    summary: z.string().min(1, { message: "Summary is required" }),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_time);
      const end = new Date(data.end_time);
      return start < end;
    },
    {
      message: "Start time must be before end time",
      path: ["startTime"],
    }
  );

export let loader = async () => {
  // Pseudo-code: load employees for the dropdown.
  const employeeService = new EmployeeService();
  const employees = await employeeService.getEmployees({});
  return json({ employees: employees.employees });
};

export let action = async ({ request }: any) => {
  const formData = await request.formData();
  const data = {
    start_time: formData.get("startTime"),
    end_time: formData.get("endTime"),
    employee_id: formData.get("employeeId"),
    summary: formData.get("summary"),
  };

  const result = timesheetSchema.safeParse(data);
  if (!result.success) {
    return json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const timesheetService = new TimesheetService();
  await timesheetService.createTimesheet({
    ...result.data,
    employee_id: Number(result.data.employee_id),
  });
  // Pseudo-code: Insert timesheet into DB
  // await db.timesheet.create({ startTime, endTime, employeeId, summary });

  return redirect("/timesheets");
};

export default function NewTimesheet() {
  const actionData: any = useActionData();
  const { employees } = useLoaderData() as any;
  console.log("actionData", actionData);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Timesheet</h1>
      <Form method="post" className="space-y-6">
        {/* Start Time */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Start Time:</label>
          <input
            type="datetime-local"
            name="startTime"
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.startTime && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.startTime}
            </p>
          )}
        </div>
        {/* End Time */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">End Time:</label>
          <input
            type="datetime-local"
            name="endTime"
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.endTime && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.endTime}
            </p>
          )}
        </div>
        {/* Employee Selection */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Employee:</label>
          <select
            name="employeeId"
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select an employee</option>
            {employees.map((emp: any) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
          {actionData?.errors?.employeeId && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.employeeId}
            </p>
          )}
        </div>
        {/* Summary */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Summary:</label>
          <input
            type="text"
            name="summary"
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.summary && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.summary}
            </p>
          )}
        </div>
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
