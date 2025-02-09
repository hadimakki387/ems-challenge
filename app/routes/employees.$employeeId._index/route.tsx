import {
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router";
import { EmployeeService } from "~/db/services/employeeService";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

// Define the department enum for validation.
const DepartmentEnum = z.enum(["Engineering", "Sales", "Marketing", "HR"]);

const employeeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  dob: z.string().min(1, { message: "Date of birth is required" }),
  job_title: z.string().min(1, { message: "Job title is required" }),
  department: DepartmentEnum,
  salary: z.preprocess(
    (val) => Number(val),
    z.number().min(0, { message: "Salary must be a positive number" })
  ),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().optional().nullable(),
  photo_path: z.string().nullable().optional(),
  documents: z.string().nullable().optional(),
});

export let loader = async ({ params }: any) => {
  const employeeService = new EmployeeService();
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

  let photoPath = null;
  let documents = null;

  const photo = formData.get("photo");
  if (photo && typeof photo !== "string" && photo.size > 0) {
    const filename = `${Date.now()}-${photo.name}`;
    const uploadDir = path.join(process.cwd(), "uploads", "photos");
    const uploadPath = path.join(uploadDir, filename);
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await photo.arrayBuffer());
    await fs.writeFile(uploadPath, buffer);
    photoPath = `/uploads/photos/${filename}`;
  }

  const cv = formData.get("cv");
  if (cv && typeof cv !== "string" && cv.size > 0) {
    const filename = `${Date.now()}-${cv.name}`;
    const uploadDir = path.join(process.cwd(), "uploads", "documents");
    const uploadPath = path.join(uploadDir, filename);
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await cv.arrayBuffer());
    await fs.writeFile(uploadPath, buffer);
    documents = `/uploads/documents/${filename}`;
  }

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
    photo_path: photoPath,
    documents,
  };

  const result = employeeSchema.safeParse(employee);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  try {
    const employeeService = new EmployeeService();
    const currentEmployee = await employeeService.getEmployeeById(
      Number(params.employeeId)
    );
    if (!employee.photo_path) {
      employee.photo_path = currentEmployee?.photo_path || null;
    }
    if (!employee.documents) {
      employee.documents = currentEmployee?.documents || null;
    }
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
      <Form method="post" encType="multipart/form-data" className="space-y-4">
        {/* Photo */}
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
        {/* CV/Resume */}
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
          <select
            name="department"
            defaultValue={employee.department}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
          </select>
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
