// app/routes/timesheets._index.tsx
import { Link, useLoaderData } from "react-router";
import { openDb } from "~/db";
import { TimesheetService } from "~/db/services/timesheetService";
import { z } from "zod";
import { useState } from "react";

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
  const db = await openDb();
  const timesheetService = new TimesheetService(db);
  const timesheets = await timesheetService.getAllTimesheets();
  // Validate the timesheets data using Zod
  const validatedTimesheets = timesheetsSchema.parse(timesheets);
  return { timesheets: validatedTimesheets };
};

export default function TimesheetList() {
  const { timesheets } = useLoaderData() as { timesheets: any[] };

  const [search, setSearch] = useState("");
  const filteredSearch = timesheets.filter((emp) =>
    emp.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Timesheets</h1>
      <div className="mb-4 flex items-center justify-between">
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
      <div className="overflow-x-auto">
        <input
          type="text"
          placeholder="Search timesheets"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 mb-4"
        />
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
            {filteredSearch.map((ts) => (
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
    </div>
  );
}
