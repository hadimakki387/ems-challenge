// /src/views/EmployeeList/SearchSortFilterForm.tsx
import React from "react";
import { Form, useSubmit } from "react-router";

interface SearchSortFilterFormProps {
  search: string;
  sortField: string;
  sortOrder: "asc" | "desc";
  filterDepartment: string;
  pageSize: number;
}

export default function SearchSortFilterForm({
  search,
  sortField,
  sortOrder,
  filterDepartment,
  pageSize,
}: SearchSortFilterFormProps) {
  const submit = useSubmit();

  function onFormChange(e: React.FormEvent<HTMLFormElement>) {
    submit(e.currentTarget, { replace: true });
  }

  return (
    <Form
      method="get"
      onChange={onFormChange}
      className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4"
    >
      <input
        type="text"
        name="search"
        placeholder="Search employees"
        defaultValue={search}
        className="border border-gray-300 rounded px-3 py-2"
      />
      <select
        name="sortField"
        defaultValue={sortField}
        className="border border-gray-300 rounded px-3 py-2"
      >
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
        <option value="department">Department</option>
        <option value="job_title">Job Title</option>
      </select>
      <select
        name="sortOrder"
        defaultValue={sortOrder}
        className="border border-gray-300 rounded px-3 py-2"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <select
        name="filterDepartment"
        defaultValue={filterDepartment}
        className="border border-gray-300 rounded px-3 py-2"
      >
        <option value="">All Departments</option>
        <option value="Engineering">Engineering</option>
        <option value="Sales">Sales</option>
        <option value="Marketing">Marketing</option>
        <option value="HR">HR</option>
      </select>
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
  );
}
