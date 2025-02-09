import React from "react";

export interface FileInputProps {
  label: string;
  name: string;
  accept?: string;
}

export default function FileInput({ label, name, accept }: FileInputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium text-gray-700">
        {label}:
      </label>
      <input
        id={name}
        type="file"
        name={name}
        accept={accept}
        className="border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );
}
