import React from "react";
import { Link, Form, useLoaderData, useSubmit } from "react-router";
import { z } from "zod";
import { TimesheetService } from "~/db/services/timesheetService";

// Calendar imports from Schedule‑X
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";

// Define a Zod schema for a timesheet
const timesheetSchema = z.object({
  id: z.number(),
  employee_id: z.number(),
  start_time: z.string(),
  end_time: z.string(),
  summary: z.string().optional(),
});

// Define an array schema for timesheets
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

// Helper to format time strings (ensuring ISO-like "YYYY-MM-DD HH:mm" format)
function formatTime(time: string): string {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Subcomponent for the calendar view
function TimesheetCalendar({ timesheets }: { timesheets: any[] }) {
  const [eventsService] = React.useState(() => createEventsServicePlugin());
  const events = timesheets.map((ts) => ({
    id: ts.id.toString(),
    title: `Employee ${ts.employee_id}${ts.summary ? `: ${ts.summary}` : ""}`,
    start: formatTime(ts.start_time),
    end: formatTime(ts.end_time),
  }));

  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: events,
    plugins: [eventsService],
  });

  React.useEffect(() => {
    eventsService.getAll();
  }, [eventsService]);

  return (
    <div className="mt-4">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default function TimesheetList() {
  const {
    timesheets,
    total,
    page,
    pageSize,
    search,
    employeeFilter,
    sortField,
    sortOrder,
  } = useLoaderData() as {
    timesheets: any[];
    total: number;
    page: number;
    pageSize: number;
    search: string;
    employeeFilter: string;
    sortField: string;
    sortOrder: "asc" | "desc";
  };

  const submit = useSubmit();
  const totalPages = Math.ceil(total / pageSize);

  // Helper to build the query string for pagination and filtering.
  const getPaginationLink = (pageNumber: number) =>
    `?search=${encodeURIComponent(search)}&employeeFilter=${encodeURIComponent(
      employeeFilter
    )}&sortField=${sortField}&sortOrder=${sortOrder}&page=${pageNumber}&pageSize=${pageSize}`;

  // Use react-router's GET Form for filtering and pagination; auto-submit on change.
  function handleFormChange(e: React.FormEvent<HTMLFormElement>) {
    submit(e.currentTarget, { replace: true });
  }

  // State for view mode (table or calendar)
  const [viewMode, setViewMode] = React.useState<"table" | "calendar">("table");

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Timesheets</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <Link
            to="/timesheets/new"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add New Timesheet
          </Link>
          <Link
            to="/employees"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Employees
          </Link>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 rounded ${
              viewMode === "table"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded ${
              viewMode === "calendar"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* Filtering Form: Search bar, Employee Filter, and Page Size */}
      <Form
        method="get"
        onChange={handleFormChange}
        className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4"
      >
        <input
          type="text"
          name="search"
          placeholder="Search timesheets"
          defaultValue={search}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="text"
          name="employeeFilter"
          placeholder="Filter by Employee ID"
          defaultValue={employeeFilter}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <select
          name="pageSize"
          defaultValue={pageSize}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>
      </Form>

      {/* Conditional Rendering: Table or Calendar View */}
      {viewMode === "table" ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Employee ID</th>
                  <th className="py-3 px-6 text-left">Start Time</th>
                  <th className="py-3 px-6 text-left">End Time</th>
                  <th className="py-3 px-6 text-left">Summary</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {timesheets.map((ts) => (
                  <tr
                    key={ts.id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">
                      <Link
                        to={`/timesheets/${ts.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {ts.employee_id}
                      </Link>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {formatTime(ts.start_time)}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {formatTime(ts.end_time)}
                    </td>
                    <td className="py-3 px-6 text-left">{ts.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Links */}
          <nav aria-label="Page navigation" className="mt-4">
            <ul className="flex items-center -space-x-px h-8 text-sm">
              <li>
                {page > 1 ? (
                  <Link
                    to={getPaginationLink(page - 1)}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l hover:bg-gray-100 hover:text-gray-700"
                  >
                    <span className="sr-only">Previous</span>
                    &laquo;
                  </Link>
                ) : (
                  <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-400 bg-gray-100 border border-gray-300 rounded-l">
                    <span className="sr-only">Previous</span>
                    &laquo;
                  </span>
                )}
              </li>
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <li key={pageNumber}>
                    {pageNumber === page ? (
                      <span
                        aria-current="page"
                        className="z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50"
                      >
                        {pageNumber}
                      </span>
                    ) : (
                      <Link
                        to={getPaginationLink(pageNumber)}
                        className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                      >
                        {pageNumber}
                      </Link>
                    )}
                  </li>
                );
              })}
              <li>
                {page < totalPages ? (
                  <Link
                    to={getPaginationLink(page + 1)}
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r hover:bg-gray-100 hover:text-gray-700"
                  >
                    <span className="sr-only">Next</span>
                    &raquo;
                  </Link>
                ) : (
                  <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-400 bg-gray-100 border border-gray-300 rounded-r">
                    <span className="sr-only">Next</span>
                    &raquo;
                  </span>
                )}
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <TimesheetCalendar timesheets={timesheets} />
      )}
    </div>
  );
}
