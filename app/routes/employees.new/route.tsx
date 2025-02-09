import { Form, Link, redirect, useActionData } from "react-router";
import { EmployeeService } from "~/db/services/employeeService";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

// Define the department enum.
const DepartmentEnum = z.enum(["Engineering", "Sales", "Marketing", "HR"]);

export let action = async ({ request }: any) => {
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
    salary: Number(formData.get("salary")),
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
    job_type: formData.get("job_type") as string,
    photo_path: photoPath,
    documents,
  };

  const employeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required"),
    dob: z.string().min(1, "Date of birth is required"),
    job_title: z.string().min(1, "Job title is required"),
    department: DepartmentEnum,
    salary: z.preprocess(
      (val) => Number(val),
      z.number().min(0, "Salary must be positive")
    ),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional().nullable(),
    job_type: z.string().min(1, "Job Type is required"),
    photo_path: z.string().nullable().optional(),
    documents: z.string().nullable().optional(),
  });

  const validation = employeeSchema.safeParse(employee);
  if (!validation.success) {
    const errors = validation.error.flatten().fieldErrors;
    return { errors };
  }

  try {
    const employeeService = new EmployeeService();
    await employeeService.createEmployee(employee);
  } catch (error) {
    console.error("Error creating employee:", error);
    return { errors: { server: "Server error creating employee." } };
  }

  return redirect("/employees");
};

export default function NewEmployee() {
  const actionData: any = useActionData();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Employee</h1>
      <Form method="post" encType="multipart/form-data" className="space-y-6">
        {/* Photo */}
        <div className="flex flex-col">
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
        </div>
        {/* Name */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            className="border border-gray-300 rounded px-3 py-2"
          />
          {actionData?.errors?.name && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.name}
            </p>
          )}
        </div>
        {/* Job Type */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Job Type:</label>
          <select
            name="job_type"
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="fulltime">Full Time</option>
            <option value="parttime">Part Time</option>
            <option value="contract">Contract</option>
            <option value="intern">Intern</option>
          </select>
          {actionData?.errors?.job_type && (
            <p className="text-red-500 text-sm mt-1">
              {actionData.errors.job_type}
            </p>
          )}
        </div>
        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
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
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {/* Date of Birth */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">
            Date of Birth:
          </label>
          <input
            type="date"
            name="dob"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {/* Job Title */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Job Title:</label>
          <input
            type="text"
            name="job_title"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {/* Department */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Department:</label>
          <select
            name="department"
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
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {/* Start Date */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Start Date:</label>
          <input
            type="date"
            name="start_date"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {/* End Date */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">End Date:</label>
          <input
            type="date"
            name="end_date"
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
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
