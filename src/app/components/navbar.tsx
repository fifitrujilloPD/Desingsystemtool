import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-gray-800 z-50 transition-colors">
      <div className="h-full px-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          Design System
        </h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>
    </nav>
  );
}
