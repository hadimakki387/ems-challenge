// /src/views/timesheets/TimesheetListView/FilteringForm.tsx

interface FilteringFormProps {
  search: string;
  employeeFilter: string;
  pageSize: number;
}

export default function FilteringForm({
  search,
  employeeFilter,
  pageSize,
}: FilteringFormProps) {
  return (
    <>
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
    </>
  );
}
