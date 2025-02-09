// /src/views/timesheets/EditTimesheetView/SummaryInput.tsx
import TextInput from "~/components/TextInput";

interface SummaryInputProps {
  defaultValue: string;
}

export default function SummaryInput({ defaultValue }: SummaryInputProps) {
  return (
    <TextInput label="Summary" name="summary" defaultValue={defaultValue} />
  );
}
