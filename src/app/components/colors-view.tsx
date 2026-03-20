import { useState } from "react";
import { Code2, LayoutGrid, Columns, Rows } from "lucide-react";
import { ColorCards } from "./color-cards";
import { ColorColumns } from "./color-columns";
import { ColorRows } from "./color-rows";
import { FoundationTable } from "./foundation-table";
import { CodeModal } from "./code-modal";
import { getPrimaryColors, getSecondaryColors, getFoundationColors } from "../utils/token-parser";

type ViewMode = "cards" | "columns" | "rows";
type Tab = "primary" | "secondary" | "foundation";

export function ColorsView() {
  const [activeTab, setActiveTab] = useState<Tab>("primary");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [showCodeModal, setShowCodeModal] = useState(false);

  const primaryColors = getPrimaryColors();
  const secondaryColors = getSecondaryColors();
  const foundationColors = getFoundationColors();

  const renderContent = () => {
    if (activeTab === "foundation") {
      return <FoundationTable colors={foundationColors} />;
    }

    const colors = activeTab === "primary" ? primaryColors : secondaryColors;

    switch (viewMode) {
      case "cards":
        return <ColorCards colors={colors} />;
      case "columns":
        return <ColorColumns colors={colors} />;
      case "rows":
        return <ColorRows colors={colors} />;
      default:
        return <ColorCards colors={colors} />;
    }
  };

  return (
    <div className="max-w-[1400px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Colors
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              Visualiza, gestiona y edita los colores del sistema de diseño en Light y Dark Mode.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800 mb-6">
          <button
            onClick={() => setActiveTab("primary")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "primary"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Primary Colors
          </button>
          <button
            onClick={() => setActiveTab("secondary")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "secondary"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Secondary Colors
          </button>
          <button
            onClick={() => setActiveTab("foundation")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "foundation"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            Foundation Colors
          </button>
        </div>

        {/* View Controls - Below Tabs */}
        {activeTab !== "foundation" && (
          <div className="flex items-center justify-start gap-2 mb-6">
            <div className="flex items-center bg-white dark:bg-gray-900 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode("columns")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "columns"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <Columns className="w-4 h-4" />
                Columns
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "cards"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Cards
              </button>
              <button
                onClick={() => setViewMode("rows")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "rows"
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <Rows className="w-4 h-4" />
                Rows
              </button>
            </div>

            <button
              onClick={() => setShowCodeModal(true)}
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              title="View Code"
            >
              <Code2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div>{renderContent()}</div>

      {/* Code Modal */}
      {showCodeModal && (
        <CodeModal onClose={() => setShowCodeModal(false)} />
      )}
    </div>
  );
}