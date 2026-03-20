import { useLocation } from "react-router";

export function PlaceholderView() {
  const location = useLocation();
  const name = location.pathname.split("/").filter(Boolean).pop() || "Page";
  const formatted = name.charAt(0).toUpperCase() + name.slice(1);

  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="text-5xl">🚧</div>
        <h2 className="text-xl text-gray-900 dark:text-white">{formatted}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This section is coming soon.
        </p>
      </div>
    </div>
  );
}
