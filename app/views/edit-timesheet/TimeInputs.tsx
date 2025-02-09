// /src/views/timesheets/EditTimesheetView/TimeInputs.tsx

import type { Timesheet } from "~/db/schema/timesheet";

interface TimeInputsProps {
  timesheet: Timesheet;
  errors?: { start_time?: string; end_time?: string };
}

export default function TimeInputs({ timesheet, errors }: TimeInputsProps) {
  const startDefault = new Date(timesheet.start_time)
    .toISOString()
    .slice(0, 16);
  const endDefault = new Date(timesheet.end_time).toISOString().slice(0, 16);

  return (
    <>
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Start Time:</label>
        <input
          type="datetime-local"
          name="start_time"
          defaultValue={startDefault}
          className="border border-gray-300 rounded px-3 py-2"
        />
        {errors?.start_time && (
          <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">End Time:</label>
        <input
          type="datetime-local"
          name="end_time"
          defaultValue={endDefault}
          className="border border-gray-300 rounded px-3 py-2"
        />
        {errors?.end_time && (
          <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>
        )}
      </div>
    </>
  );
}
