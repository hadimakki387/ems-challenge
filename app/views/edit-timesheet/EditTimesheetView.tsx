// /src/views/timesheets/EditTimesheetView/EditTimesheetView.tsx
import { Form, Link } from "react-router";
import EmployeeSelect from "./EmployeeSelect";
import TimeInputs from "./TimeInputs";
import SummaryInput from "./SummaryInput";
import type { Timesheet } from "~/db/schema/timesheet";
import type { Employee } from "~/db/schema/employee";
import type { ActionData } from "~/interfaces/employee";
import type { TimeSheetActionData } from "~/interfaces/timesheet";

interface EditTimesheetViewProps {
  timesheet: Timesheet;
  employees: Employee[];
  actionData?: TimeSheetActionData;
}

export default function EditTimesheetView({
  timesheet,
  employees,
  actionData,
}: EditTimesheetViewProps) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Timesheet</h1>
      <Form method="post" className="space-y-4">
        <EmployeeSelect
          employees={employees}
          selectedEmployeeId={timesheet.employee_id}
          error={actionData?.errors?.employee_id}
        />
        <TimeInputs
          timesheet={timesheet}
          errors={{
            start_time: actionData?.errors?.start_time,
            end_time: actionData?.errors?.end_time,
          }}
        />
        <SummaryInput defaultValue={timesheet.summary || ""} />
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
