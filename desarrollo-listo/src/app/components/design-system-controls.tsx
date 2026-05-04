import { ChevronDown } from "lucide-react";

/** Shared controls used across module views (Buttons, Icons, Typography, etc.) */

export function ControlSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="w-full appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 pr-8 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const cols = Math.min(options.length, 4);
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div
        className="grid gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-2 py-1.5 rounded-md text-[11px] font-medium leading-4 text-center transition-all ${
              value === o.value
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
