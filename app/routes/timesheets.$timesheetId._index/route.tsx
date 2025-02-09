// /src/views/timesheets/EditTimesheet.tsx
import { redirect, useActionData, useLoaderData } from "react-router";
import { z } from "zod";
import type { Employee } from "~/db/schema/employee";
import type { Timesheet } from "~/db/schema/timesheet";
import { EmployeeService } from "~/db/services/employeeService";
import { TimesheetService } from "~/db/services/timesheetService";
import type { ActionData } from "~/interfaces/employee";
import type { TimesheetErrors } from "~/interfaces/timesheet";
import EditTimesheetView from "~/views/edit-timesheet/EditTimesheetView";

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

export default function EditTimesheetRoute() {
  const { timesheet, employees } = useLoaderData() as {
    timesheet: Timesheet;
    employees: Employee[];
  };
  const actionData = useActionData() as ActionData<TimesheetErrors>;
  return (
    <EditTimesheetView
      timesheet={timesheet}
      employees={employees}
      actionData={actionData}
    />
  );
}
