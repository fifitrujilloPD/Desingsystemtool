import { Search, Palette, Circle, Grid, Boxes, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";

interface TreeItem {
  id: string;
  label: string;
  path: string;
}

interface Category {
  id: string;
  label: string;
  icon: typeof Palette;
  children: TreeItem[];
}

const categories: Category[] = [
  {
    id: "foundations",
    label: "Foundations",
    icon: Palette,
    children: [
      { id: "colors", label: "Colors", path: "/colors" },
      { id: "icons", label: "Icons", path: "/icons" },
      { id: "typography", label: "Typography", path: "/typography" },
      { id: "spacing", label: "Spacing", path: "/spacing" },
      { id: "shadows", label: "Shadows", path: "/shadows" },
    ],
  },
  {
    id: "atoms",
    label: "Atoms",
    icon: Circle,
    children: [
      { id: "buttons", label: "Buttons", path: "/atoms" },
      { id: "inputs", label: "Inputs", path: "/atoms/inputs" },
      { id: "badges", label: "Badges", path: "/atoms/badges" },
      { id: "icons", label: "Icons", path: "/atoms/icons" },
    ],
  },
  {
    id: "molecules",
    label: "Molecules",
    icon: Grid,
    children: [
      { id: "cards", label: "Cards", path: "/molecules" },
      { id: "forms", label: "Forms", path: "/molecules/forms" },
      { id: "modals", label: "Modals", path: "/molecules/modals" },
      { id: "dropdowns", label: "Dropdowns", path: "/molecules/dropdowns" },
    ],
  },
  {
    id: "organisms",
    label: "Organisms",
    icon: Boxes,
    children: [
      { id: "navbar", label: "Navbar", path: "/organisms" },
      { id: "sidebar", label: "Sidebar", path: "/organisms/sidebar" },
      { id: "tables", label: "Tables", path: "/organisms/tables" },
      { id: "layouts", label: "Layouts", path: "/organisms/layouts" },
    ],
  },
];

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Auto-expand the category that contains the active route
  useEffect(() => {
    const active = categories.find((cat) =>
      cat.children.some((child) => child.path === location.pathname)
    );
    if (active) {
      setExpanded((prev) => ({ ...prev, [active.id]: true }));
    }
  }, [location.pathname]);

  const toggleCategory = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = searchQuery
    ? categories
        .map((cat) => ({
          ...cat,
          children: cat.children.filter((child) =>
            child.label.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((cat) =>
          cat.children.length > 0 ||
          cat.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : categories;

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-colors">
      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 transition-colors"
          />
        </div>

        {/* Tree Navigation */}
        <nav className="space-y-0.5">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            const isOpen = expanded[category.id] || !!searchQuery;
            const hasActiveChild = category.children.some(
              (child) => child.path === location.pathname
            );

            return (
              <div key={category.id}>
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    hasActiveChild
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                >
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{category.label}</span>
                  <span className="ml-auto text-xs text-gray-400 dark:text-gray-600">
                    {category.children.length}
                  </span>
                </button>

                {/* Children */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-5 pl-3 border-l border-gray-200 dark:border-gray-800 space-y-0.5 py-1">
                    {category.children.map((child) => {
                      const isActive = location.pathname === child.path;
                      return (
                        <Link
                          key={child.id}
                          to={child.path}
                          className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                            isActive
                              ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-200"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}