// /src/views/employees/NewEmployeeForm.tsx
import { Form, Link } from "react-router";
import type { EmployeeActionData } from "~/interfaces/employee";
import EmploymentDetailsSection from "./EmploymentDetailsSection";
import FileUploadSection from "./FileUploadSection";
import PersonalInfoSection from "./PersonalInfoSection";

interface NewEmployeeFormProps {
  actionData?: EmployeeActionData;
}

export default function NewEmployeeForm({ actionData }: NewEmployeeFormProps) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Employee</h1>
      <Form method="post" encType="multipart/form-data" className="space-y-6">
        <FileUploadSection />
        <PersonalInfoSection actionData={actionData} />
        <EmploymentDetailsSection actionData={actionData} />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Save Employee
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
