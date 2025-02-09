import React from "react";

export interface SelectInputProps {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export default function SelectInput({
  label,
  name,
  defaultValue,
  options,
  error,
}: SelectInputProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-1 font-medium text-gray-700">
        {label}:
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="border border-gray-300 rounded px-3 py-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
