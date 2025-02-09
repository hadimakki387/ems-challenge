// /src/views/employees/NewEmployeeForm/FileUploadSection.tsx
import FileInput from "~/components/Form/FileInput";

export default function FileUploadSection() {
  return (
    <>
      <FileInput label="Photo" name="photo" accept="image/*" />
      <FileInput label="CV/Resume" name="cv" accept=".pdf,.doc,.docx" />
    </>
  );
}
