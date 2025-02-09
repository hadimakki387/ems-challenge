// /src/views/timesheets/TimesheetListView/TimesheetCalendar.tsx
import React from "react";
import { ScheduleXCalendar, useCalendarApp } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { formatTime } from "./helpers"; // We'll define formatTime next
import "@schedule-x/theme-default/dist/index.css";
import type { Timesheet } from "~/db/schema/timesheet";

interface TimesheetCalendarProps {
  timesheets: Timesheet[];
}

export default function TimesheetCalendar({
  timesheets,
}: TimesheetCalendarProps) {
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
