// /src/views/timesheets/NewTimesheet.tsx
import { redirect, useActionData, useLoaderData } from "react-router";
import { json } from "utils/json";
import { z } from "zod";
import type { Employee } from "~/db/schema/employee";
import { EmployeeService } from "~/db/services/employeeService";
import { TimesheetService } from "~/db/services/timesheetService";
import type { TimeSheetActionData } from "~/interfaces/timesheet";
import NewTimesheetForm from "~/views/create-timesheet";

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
  // Load employees for the dropdown.
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
  return redirect("/timesheets");
};

export default function NewTimesheetRoute() {
  const actionData = useActionData<TimeSheetActionData>() || {};
  const { employees } = useLoaderData() as { employees: Employee[] };
  return <NewTimesheetForm employees={employees} actionData={actionData} />;
}
