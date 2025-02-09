// /src/views/timesheets/TimesheetListView.tsx
import React from "react";
import { Form, Link, useSubmit } from "react-router";
import type { GetAllTimeSheetsLoaderData } from "~/interfaces/timesheet";
import FilteringForm from "./FilteringForm";
import Pagination from "./Pagination";
import TableView from "./TableView";
import TimesheetCalendar from "./TimesheetCalendar";

interface data {
  data: GetAllTimeSheetsLoaderData;
}

export default function TimesheetListView(data: data) {
  const {
    data: {
      timesheets,
      total,
      page,
      pageSize,
      search,
      employeeFilter,
      sortField,
      sortOrder,
    },
  } = data;
  const submit = useSubmit();
  const totalPages = Math.ceil(total / pageSize);

  const getPaginationLink = (pageNumber: number) =>
    `?search=${encodeURIComponent(search)}&employeeFilter=${encodeURIComponent(
      employeeFilter
    )}&sortField=${sortField}&sortOrder=${sortOrder}&page=${pageNumber}&pageSize=${pageSize}`;

  // Auto-submit the filter form on change.
  function handleFormChange(e: React.FormEvent<HTMLFormElement>) {
    submit(e.currentTarget, { replace: true });
  }

  // Local state for switching view mode: "table" or "calendar".
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

      {/* Filtering Form */}
      <Form
        method="get"
        onChange={handleFormChange}
        className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4"
      >
        <FilteringForm
          search={search}
          employeeFilter={employeeFilter}
          pageSize={pageSize}
        />
      </Form>

      {/* Conditional Rendering for Table or Calendar */}
      {viewMode === "table" ? (
        <>
          <TableView timesheets={timesheets} />
          {timesheets.length ? (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              getPaginationLink={getPaginationLink}
            />
          ) : null}
        </>
      ) : (
        <TimesheetCalendar timesheets={timesheets} />
      )}
    </div>
  );
}
