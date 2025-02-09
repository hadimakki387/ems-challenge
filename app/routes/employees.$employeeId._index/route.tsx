// app/routes/employees.$employeeId._index.tsx
import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router";
import { openDb } from "~/db";
import { EmployeeService } from "~/db/services/employeeService";
import { z } from "zod";

// Define the Zod schema for employee editing.
const employeeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  dob: z.string().min(1, { message: "Date of birth is required" }),
  job_title: z.string().min(1, { message: "Job title is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  salary: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Salary must be a positive number" })
  ),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().optional().nullable(),
});

export let loader = async ({ params }: any) => {
  const db = await openDb();
  const employeeService = new EmployeeService(db);
  const employee = await employeeService.getEmployeeById(
    Number(params.employeeId)
  );
  if (!employee) {
    throw new Response("Employee not found", { status: 404 });
  }
  return { employee };
};

export let action = async ({ request, params }: any) => {
  const formData = await request.formData();
  const employee = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    dob: formData.get("dob") as string,
    job_title: formData.get("job_title") as string,
    department: formData.get("department") as string,
    salary: formData.get("salary"),
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    photo_path: null,
    documents: null,
  };

  // Validate using Zod
  const result = employeeSchema.safeParse(employee);
  if (!result.success) {
    // Return flattened errors so they can be displayed in the UI.
    return { errors: result.error.flatten().fieldErrors };
  }

  try {
    const db = await openDb();
    const employeeService = new EmployeeService(db);
    await employeeService.updateEmployee(
      Number(params.employeeId),
      employee as any
    );
  } catch (error) {
    console.error("Error updating employee:", error);
    return { errors: { server: "Server error updating employee." } };
  }

  return redirect("/employees");
};

export default function EditEmployee() {
  const { employee } = useLoaderData() as { employee: any };
  const actionData: any = useActionData();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Employee</h1>
      <Form method="post" className="space-y-4">
        {/* Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            defaultValue={employee.name}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.name && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.name}
            </p>
          )}
        </div>
        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            defaultValue={employee.email}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.email && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.email}
            </p>
          )}
        </div>
        {/* Phone */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Phone:</label>
          <input
            type="text"
            name="phone"
            defaultValue={employee.phone}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.phone && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.phone}
            </p>
          )}
        </div>
        {/* Date of Birth */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Date of Birth:
          </label>
          <input
            type="date"
            name="dob"
            defaultValue={employee.dob}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.dob && (
            <p className="text-red-500 text-sm mt-1">{actionData.errors.dob}</p>
          )}
        </div>
        {/* Job Title */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Job Title:</label>
          <input
            type="text"
            name="job_title"
            defaultValue={employee.job_title}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.job_title && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.job_title}
            </p>
          )}
        </div>
        {/* Department */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Department:</label>
          <input
            type="text"
            name="department"
            defaultValue={employee.department}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.department && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.department}
            </p>
          )}
        </div>
        {/* Salary */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Salary:</label>
          <input
            type="number"
            name="salary"
            defaultValue={employee.salary}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.salary && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.salary}
            </p>
          )}
        </div>
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Start Date:</label>
          <input
            type="date"
            name="start_date"
            defaultValue={employee.start_date}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.start_date && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.start_date}
            </p>
          )}
        </div>
        {/* End Date */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">End Date:</label>
          <input
            type="date"
            name="end_date"
            defaultValue={employee.end_date || ""}
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.end_date && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.end_date}
            </p>
          )}
        </div>
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
