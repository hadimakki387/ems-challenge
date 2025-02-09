import React from "react";

export interface TextInputProps {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  error?: string | string[];
}

export default function TextInput({
  label,
  name,
  defaultValue,
  type = "text",
  error,
}: TextInputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium text-gray-700">
        {label}:
      </label>
      <input
        id={name}
        type={type}
        name={name}
        defaultValue={defaultValue}
        className="border border-gray-300 rounded px-3 py-2"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
