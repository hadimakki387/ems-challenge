// /src/views/employees/NewEmployee.tsx
import fs from "fs/promises";
import path from "path";
import { redirect, useActionData } from "react-router";
import { z } from "zod";
import { EmployeeService } from "~/db/services/employeeService";
import type { ActionData, EmployeeActionData } from "~/interfaces/employee";
import NewEmployeeForm from "~/views/add-employee";

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
      z.number().min(100, "Salary must be positive")
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

export default function NewEmployeeRoute() {
  const actionData = useActionData<EmployeeActionData>();
  return <NewEmployeeForm actionData={actionData} />;
}
