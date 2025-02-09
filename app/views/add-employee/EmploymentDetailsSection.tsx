// /src/views/employees/NewEmployeeForm/EmploymentDetailsSection.tsx
import SelectInput from "~/components/SelectInput";
import TextInput from "~/components/TextInput";
import { departments, jobTitles, jobTypes } from "~/constants/employees";
import type { EmployeeActionData } from "~/interfaces/employee";

interface EmploymentDetailsSectionProps {
  actionData?: EmployeeActionData;
}

export default function EmploymentDetailsSection({
  actionData,
}: EmploymentDetailsSectionProps) {
  return (
    <>
      <SelectInput
        options={jobTitles.map((item) => {
          return {
            value: item,
            label: item,
          };
        })}
        label="Job Title"
        name="job_title"
        error={actionData?.errors?.job_title}
      />
      <div className="flex flex-col">
        <SelectInput
          label="Job Type"
          name="job_type"
          options={jobTypes.map((item) => {
            return {
              value: item,
              label: item,
            };
          })}
          error={actionData?.errors?.job_type}
        />

        {actionData?.errors?.job_type && (
          <p className="text-red-500 text-sm mt-1">
            {actionData.errors.job_type}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <SelectInput
          name="department"
          options={departments.map((item) => {
            return {
              value: item,
              label: item,
            };
          })}
          error={actionData?.errors?.department}
          label="Department"
        />
        {actionData?.errors?.department && (
          <p className="text-red-500 text-sm mt-1">
            {actionData.errors.department}
          </p>
        )}
      </div>
      <TextInput
        label="Salary"
        name="salary"
        type="number"
        error={actionData?.errors?.salary}
      />
      <TextInput
        label="Start Date"
        name="start_date"
        type="date"
        error={actionData?.errors?.start_date}
      />
      <TextInput
        label="End Date"
        name="end_date"
        type="date"
        error={actionData?.errors?.end_date}
      />
    </>
  );
}
