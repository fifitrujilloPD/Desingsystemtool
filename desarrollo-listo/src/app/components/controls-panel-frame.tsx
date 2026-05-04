import { ChevronLeft, ChevronRight } from "lucide-react";
import { useControlsPanel } from "./controls-panel-context";
import { cn } from "./ui/utils";

/**
 * Panel fijo derecho con controles: permite colapsar a una franja estrecha y volver a abrir.
 */
export function ControlsPanelFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const { expanded, toggle } = useControlsPanel();

  return (
    <div
      className={cn(
        "fixed top-16 right-0 z-10 flex flex-col border-l border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-chrome)] transition-[width] duration-200 ease-in-out",
        expanded ? "w-80 h-[calc(100vh-4rem)]" : "w-12 h-[calc(100vh-4rem)]",
      )}
    >
      {expanded ? (
        <>
          <div className="flex shrink-0 items-center justify-end border-b border-gray-200 dark:border-gray-800 px-1 py-1">
            <button
              type="button"
              onClick={toggle}
              aria-expanded
              aria-controls="design-system-controls-panel"
              title="Ocultar panel de controles"
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div
            id="design-system-controls-panel"
            className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
          >
            {children}
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center pt-3">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={false}
            aria-controls="design-system-controls-panel"
            title="Mostrar panel de controles"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
