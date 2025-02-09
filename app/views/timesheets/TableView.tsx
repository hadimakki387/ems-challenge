// /src/views/timesheets/TimesheetListView/TableView.tsx
import { Link } from "react-router";
import { formatTime } from "./helpers";
import type { Timesheet } from "~/db/schema/timesheet";

interface TableViewProps {
  timesheets: Timesheet[];
}

export default function TableView({ timesheets }: TableViewProps) {
  return (
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
          {timesheets.length ? (
            timesheets.map((ts) => (
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
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-3 px-6 text-center">
                No timesheets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
