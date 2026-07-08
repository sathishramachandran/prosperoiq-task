type CheckboxProps = {
  label: string;
  checked?: boolean;
  onChange?: (val: boolean) => void;
};

const Checkbox = ({ label, checked = false, onChange }: CheckboxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer px-2 py-1 rounded hover:bg-gray-100 transition">
      {/* Hidden Native Input */}
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="hidden"
      />

      {/* Custom UI */}
      <div
        className={`min-w-4 min-h-4 flex items-center justify-center border rounded 
        ${checked ? "bg-blue-600 border-blue-600" : "border-gray-400"}`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 011.414-1.414l2.543 2.543 6.543-6.543a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
};

export default Checkbox;