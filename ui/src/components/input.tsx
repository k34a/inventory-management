"use client";

interface InputProps {
  label: string;
  fieldName: string;
  value: string;
  handleInputChange: (e: any) => void;
  disabled: boolean;
  type?: string;
  error?: string;
}

const Input = (props: InputProps) => {
  const inputType = props.type ?? "text";
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={props.fieldName}
        className="block text-md font-medium text-gray-700"
      >
        {props.label}
      </label>
      <input
        type={inputType}
        id={props.fieldName}
        name={props.fieldName}
        value={props.value}
        onChange={props.handleInputChange}
        disabled={props.disabled}
        className={`py-2 px-3 w-full rounded-md border border-gray-300 focus:border-gray-500 shadow-sm ${
          props.disabled ? "bg-gray-100" : ""
        }`}
      />
      {props.error && <div className="text-red-500 text-sm">{props.error}</div>}
    </div>
  );
};

export default Input;
