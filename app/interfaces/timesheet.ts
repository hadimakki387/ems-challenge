import type { Timesheet } from "~/db/schema/timesheet";
import type { ActionData } from "./employee";

export type TimesheetErrors = {
  [K in keyof Timesheet]?: string;
} & {
  server?: string[];
};

export interface TimeSheetActionData extends ActionData<TimesheetErrors> {}

export interface GetTimeSheetLoaderData {
  timesheet: Timesheet;
}

export interface GetAllTimeSheetsLoaderData {
  timesheets: Timesheet[];
  total: number;
  page: number;
  pageSize: number;
  employeeFilter: string;
  search: string;
  sortField: string;
  sortOrder: "asc" | "desc";
  filterDepartment: string;
}
