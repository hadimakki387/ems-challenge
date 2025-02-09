// /src/views/employees/NewEmployeeForm/PersonalInfoSection.tsx
import TextInput from "~/components/Form/TextInput";
import type { EmployeeActionData } from "~/interfaces/employee";

interface PersonalInfoSectionProps {
  actionData?: EmployeeActionData;
}

export default function PersonalInfoSection({
  actionData,
}: PersonalInfoSectionProps) {
  return (
    <>
      <TextInput label="Name" name="name" error={actionData?.errors?.name} />
      <TextInput
        label="Email"
        name="email"
        type="email"
        error={actionData?.errors?.email}
      />
      <TextInput label="Phone" name="phone" error={actionData?.errors?.phone} />
      <TextInput
        label="Date of Birth"
        name="dob"
        type="date"
        error={actionData?.errors?.dob}
      />
    </>
  );
}
