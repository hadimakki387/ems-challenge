import fs from "fs/promises";
import path from "path";
import {
  redirect,
  useActionData,
  useLoaderData,
  type ActionFunction,
  type LoaderFunction,
} from "react-router";
import { z } from "zod";
import { EmployeeService } from "~/db/services/employeeService";
import type {
  ActionData,
  EmployeeActionData,
  GetEmployeeLoaderData,
} from "~/interfaces/employee";
import EditEmployeeView from "~/views/edit-employees/edit";

// Define the department enum for validation.
const DepartmentEnum = z.enum(["Engineering", "Sales", "Marketing", "HR"]);

export const employeeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  dob: z.string().min(1, { message: "Date of birth is required" }),
  job_title: z.string().min(1, { message: "Job title is required" }),
  department: DepartmentEnum,
  salary: z.preprocess((val) => {
    console.log("val", val);
    return Number(val);
  }, z.number().min(100, { message: "Salary must be a positive number" })),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().optional().nullable(),
  photo_path: z.string().nullable().optional(),
  documents: z.string().nullable().optional(),
});

// Infer the Employee type from the schema.
export type Employee = z.infer<typeof employeeSchema>;

// Allow employeeId to be optional in the params, then check at runtime.
interface LoaderArgs {
  params: {
    employeeId?: string;
  };
}

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  if (!params.employeeId) {
    throw new Response("Employee id is required", { status: 400 });
  }
  const employeeService = new EmployeeService();
  const employee = await employeeService.getEmployeeById(
    Number(params.employeeId)
  );

  if (!employee) {
    throw new Response("Employee not found", { status: 404 });
  }
  return { employee: { ...employee, id: Number(params.employeeId) } };
};

interface ActionArgs {
  request: Request;
  params: {
    employeeId?: string;
  };
}

export const action: ActionFunction = async ({
  request,
  params,
}: ActionArgs) => {
  if (!params.employeeId) {
    return { errors: { server: ["Employee id is required"] } };
  }

  const formData = await request.formData();

  let photoPath: string | null = null;
  let documents: string | null = null;

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

  const employeeInput = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    dob: formData.get("dob") as string,
    job_title: formData.get("job_title") as string,
    department: formData.get("department") as string,
    salary: formData.get("salary"),
    start_date: formData.get("start_date") as string,
    end_date: formData.get("end_date") as string,
    photo_path: photoPath,
    documents,
  };

  const result = employeeSchema.safeParse(employeeInput);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  try {
    const employeeService = new EmployeeService();
    const currentEmployee = await employeeService.getEmployeeById(
      Number(params.employeeId)
    );
    if (!employeeInput.photo_path) {
      employeeInput.photo_path = currentEmployee?.photo_path ?? null;
    }
    if (!employeeInput.documents) {
      employeeInput.documents = currentEmployee?.documents ?? null;
    }
    // Use the validated data for updating.
    await employeeService.updateEmployee(
      Number(params.employeeId),
      result.data as any
    );
  } catch (error) {
    console.error("Error updating employee:", error);
    return { errors: { server: ["Server error updating employee."] } };
  }

  return redirect("/employees");
};

export default function EditEmployeeRoute() {
  const { employee } = useLoaderData<GetEmployeeLoaderData>();
  const actionData = useActionData<EmployeeActionData>();

  // Pass the fetched data to a view component.
  return <EditEmployeeView employee={employee} actionData={actionData} />;
}
