// /src/views/timesheets/TimesheetList.tsx
import { useLoaderData } from "react-router";
import { z } from "zod";
import type { Timesheet } from "~/db/schema/timesheet";
import { TimesheetService } from "~/db/services/timesheetService";
import type { GetAllTimeSheetsLoaderData } from "~/interfaces/timesheet";
import TimesheetListView from "~/views/timesheets/TimesheetListView";

// Define a Zod schema for a timesheet.
const timesheetSchema = z.object({
  id: z.number(),
  employee_id: z.number(),
  start_time: z.string(),
  end_time: z.string(),
  summary: z.string().optional(),
});

// Define an array schema for timesheets.
const timesheetsSchema = z.array(timesheetSchema);

export let loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const employeeFilter = url.searchParams.get("employeeFilter") || "";
  const page = Number(url.searchParams.get("page") || "1");
  const pageSize = Number(url.searchParams.get("pageSize") || "10");
  const sortField = url.searchParams.get("sortField") || "start_time";
  const sortOrder =
    (url.searchParams.get("sortOrder") as "asc" | "desc") || "asc";

  const timesheetService = new TimesheetService();
  const { timesheets, total } = await timesheetService.getTimesheets({
    search,
    employeeFilter,
    page,
    pageSize,
    sortField,
    sortOrder,
  });

  const validatedTimesheets = timesheetsSchema.parse(timesheets);
  return {
    timesheets: validatedTimesheets,
    total,
    page,
    pageSize,
    search,
    employeeFilter,
    sortField,
    sortOrder,
  };
};

export default function TimesheetListRoute() {
  const data = useLoaderData<GetAllTimeSheetsLoaderData>();
  return <TimesheetListView data={data} />;
}
