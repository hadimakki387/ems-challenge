// app/routes/timesheets.$timesheetId._index.tsx
import { TimesheetService } from "~/db/services/timesheetService";
import { EmployeeService } from "~/db/services/employeeService";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router";
import { z } from "zod";

// Define a Zod schema for updating a timesheet.
const timesheetUpdateSchema = z
  .object({
    employee_id: z.preprocess(
      (val) => Number(val),
      z.number().min(1, { message: "Employee selection is required" })
    ),
    start_time: z.string().min(1, { message: "Start time is required" }),
    end_time: z.string().min(1, { message: "End time is required" }),
    summary: z.string().optional().nullable(),
  })
  .refine((data) => new Date(data.start_time) < new Date(data.end_time), {
    message: "Start time must be before end time",
    path: ["start_time"],
  });

export let loader = async ({ params }: any) => {
  const timesheetService = new TimesheetService();
  const employeeService = new EmployeeService();
  const timesheet = await timesheetService.getTimesheetById(
    Number(params.timesheetId)
  );
  if (!timesheet) {
    throw new Response("Timesheet not found", { status: 404 });
  }
  const employees = await employeeService.getEmployees({});
  return { timesheet, employees: employees.employees };
};

export let action = async ({ request, params }: any) => {
  const formData = await request.formData();
  const data = {
    employee_id: formData.get("employee_id"),
    start_time: formData.get("start_time"),
    end_time: formData.get("end_time"),
    summary: formData.get("summary") || null,
  };

  const result = timesheetUpdateSchema.safeParse(data);
  if (!result.success) {
    // Return flattened errors so they can be displayed.
    return { errors: result.error.flatten().fieldErrors };
  }

  try {
    const timesheetService = new TimesheetService();
    await timesheetService.updateTimesheet(
      Number(params.timesheetId),
      result.data as any
    );
  } catch (error) {
    console.error("Error updating timesheet:", error);
    return { errors: { server: "Server error updating timesheet." } };
  }

  return redirect("/timesheets");
};

export default function EditTimesheet() {
  const { timesheet, employees } = useLoaderData() as {
    timesheet: any;
    employees: any[];
  };
  const actionData: any = useActionData();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Timesheet</h1>
      <Form method="post" className="space-y-4">
        {/* Employee Selection */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Employee:</label>
          <select
            name="employee_id"
            defaultValue={timesheet.employee_id}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Employee</option>
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
        {/* Start Time */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Start Time:</label>
          <input
            type="datetime-local"
            name="start_time"
            defaultValue={new Date(timesheet.start_time)
              .toISOString()
              .slice(0, 16)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.start_time && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.start_time}
            </p>
          )}
        </div>
        {/* End Time */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">End Time:</label>
          <input
            type="datetime-local"
            name="end_time"
            defaultValue={new Date(timesheet.end_time)
              .toISOString()
              .slice(0, 16)}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.end_time && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.end_time}
            </p>
          )}
        </div>
        {actionData?.errors?.time && (
          <p className="text-red-500 text-sm mt-1">{actionData.errors.time}</p>
        )}
        {/* Summary */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Summary:</label>
          <input
            type="text"
            name="summary"
            defaultValue={timesheet.summary || ""}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update Timesheet
        </button>
      </Form>
      <div className="mt-4">
        <Link
          to="/timesheets"
          className="text-blue-500 hover:underline block text-center"
        >
          Back to Timesheets
        </Link>
      </div>
    </div>
  );
}
