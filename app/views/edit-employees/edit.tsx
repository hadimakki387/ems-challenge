// /src/views/employees/EditEmployeeView.tsx
import { Form, Link } from "react-router";
import SelectInput from "~/components/Form/SelectInput";
import TextInput from "~/components/Form/TextInput";
import { departments, jobTitles, jobTypes } from "~/constants/employees";
import type { Employee } from "~/db/schema/employee";
import type { EmployeeActionData } from "~/interfaces/employee";

interface EditEmployeeViewProps {
  employee: Partial<Employee>;
  actionData?: EmployeeActionData;
}

export default function EditEmployeeView({
  employee,
  actionData,
}: EditEmployeeViewProps) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Employee</h1>
      <Form method="post" encType="multipart/form-data" className="space-y-4">
        {/* Photo Section */}
        <div className="flex flex-col">
          <div className="flex items-center w-full justify-center">
            {employee.photo_path && (
              <img
                src={employee.photo_path}
                alt="Employee Photo"
                className="mt-2 h-52 w-52 object-cover rounded-full"
              />
            )}
          </div>
          <label className="mb-1 font-medium text-gray-700">Photo:</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {/* CV/Resume Section */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">CV/Resume:</label>
          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx"
            className="border border-gray-300 rounded px-3 py-2"
          />
          {employee.documents && (
            <a
              href={employee.documents}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-500 hover:underline"
            >
              View Current Document
            </a>
          )}
        </div>
        {/* Name */}
        <TextInput
          label="Name"
          name="name"
          defaultValue={employee.name}
          error={actionData?.errors?.name}
        />
        {/* Email */}
        <TextInput
          label="Email"
          name="email"
          type="email"
          defaultValue={employee.email}
          error={actionData?.errors?.email}
        />
        {/* Phone */}
        <TextInput
          label="Phone"
          name="phone"
          defaultValue={employee.phone}
          error={actionData?.errors?.phone}
        />
        {/* Date of Birth */}
        <TextInput
          label="Date of Birth"
          name="dob"
          type="date"
          defaultValue={employee.dob}
          error={actionData?.errors?.dob}
        />
        {/* Job Title */}
        <SelectInput
          label="Job Title"
          name="job_title"
          options={jobTitles.map((item) => {
            return {
              value: item,
              label: item,
            };
          })}
          defaultValue={employee.job_title}
          error={actionData?.errors?.job_title}
        />
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

        {/* Department */}
        <div className="flex flex-col">
          <SelectInput
            name="department"
            defaultValue={employee.department}
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
        {/* Salary */}
        <TextInput
          label="Salary"
          name="salary"
          type="number"
          defaultValue={employee?.salary?.toString()}
          error={actionData?.errors?.salary}
        />
        {/* Start Date */}
        <TextInput
          label="Start Date"
          name="start_date"
          type="date"
          defaultValue={employee.start_date}
          error={actionData?.errors?.start_date}
        />
        {/* End Date */}
        <TextInput
          label="End Date"
          name="end_date"
          type="date"
          defaultValue={employee.end_date || ""}
          error={actionData?.errors?.end_date}
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Update Employee
        </button>
      </Form>
      <div className="mt-4">
        <Link
          to="/employees"
          className="text-blue-500 hover:underline block text-center"
        >
          Back to Employee List
        </Link>
      </div>
    </div>
  );
}
