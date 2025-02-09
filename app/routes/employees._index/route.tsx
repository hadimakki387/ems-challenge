import React, { useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router";
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

export let loader = async () => {
  const timesheetService = new TimesheetService();
  const timesheets = await timesheetService.getTimesheets();
  // Validate the timesheets data using Zod
  const validatedTimesheets = timesheetsSchema.parse(timesheets);
  return { timesheets: validatedTimesheets };
};

// Helper function to ensure time strings are in the correct ISO format (with seconds)
function formatTime(time: string): string {
  // Convert the time to a Date object
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
  // Create the events service plugin (using a state hook so it persists)
  const [eventsService] = useState(() => createEventsServicePlugin());
  // Map timesheets to calendar events, ensuring valid time formats
  const events = timesheets.map((ts) => ({
    id: ts.id.toString(),
    title: `Employee ${ts.employee_id}${ts.summary ? `: ${ts.summary}` : ""}`,
    start: formatTime(ts.start_time),
    end: formatTime(ts.end_time),
  }));

  // Initialize the calendar with views and events
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

  useEffect(() => {
    // Optionally fetch events if necessary
    eventsService.getAll();
  }, [eventsService]);

  return (
    <div className="mt-4">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default function TimesheetList() {
  const { timesheets } = useLoaderData() as { timesheets: any[] };

  // States for search and employee filter
  const [search, setSearch] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  // State to toggle between table and calendar views
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  // Filter timesheets by summary text and employee filter (if provided)
  const filteredTimesheets = timesheets.filter(
    (ts) =>
      ts.summary?.toLowerCase().includes(search.toLowerCase()) &&
      (employeeFilter === "" ||
        ts.employee_id.toString().includes(employeeFilter))
  );

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
      {/* Search and Employee Filter */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
        <input
          type="text"
          placeholder="Search timesheets"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mb-2 md:mb-0"
        />
        <input
          type="text"
          placeholder="Filter by Employee ID"
          value={employeeFilter}
          onChange={(e) => setEmployeeFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>
      {/* Conditional Rendering of Views */}
      {viewMode === "table" ? (
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
              {filteredTimesheets.map((ts) => (
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
                  <td className="py-3 px-6 text-left">{ts.start_time}</td>
                  <td className="py-3 px-6 text-left">{ts.end_time}</td>
                  <td className="py-3 px-6 text-left">{ts.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <TimesheetCalendar timesheets={filteredTimesheets} />
      )}
    </div>
  );
}
