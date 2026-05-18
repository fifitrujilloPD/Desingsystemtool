import { useLocation } from "react-router";
import { getMoleculeCatalogByPath } from "../data/molecule-catalog-routes";
import { useControlsPanel } from "./controls-panel-context";
import { ControlsPanelFrame } from "./controls-panel-frame";
import shell from "./radio-button.module.css";

/**
 * Placeholder de molécula (Feature 05): mismo layout de catálogo que Inputs.
 * Sustituir por la vista real al cerrar task_02 … task_05.
 */
export function MoleculePlaceholderView() {
  const location = useLocation();
  const catalog = getMoleculeCatalogByPath(location.pathname);
  const { contentPaddingClass } = useControlsPanel();

  const title = catalog?.label ?? "Molecule";
  const taskFile = catalog?.taskFile ?? "—";
  const viewFile = catalog?.viewComponent ?? "—";

  return (
    <div className="flex gap-8">
      <div className={`flex-1 min-w-0 ${contentPaddingClass}`}>
        <p className={shell.intro}>
          Molécula planificada en Feature 05. La implementación sigue el layout de
          catálogo de{" "}
          <code className="font-mono text-[length:inherit]">inputs-view.tsx</code>{" "}
          (preview, spec cards, panel de controles).
        </p>

        <div className="mb-4">
          <div className={shell.previewCard}>
            <div className={shell.previewDivider} />
            <div className={shell.previewToolbar}>
              <h2 className={shell.previewTitle}>Preview</h2>
            </div>
            <div
              className={`${shell.previewStage} flex min-h-[200px] items-center justify-center`}
            >
              <div className="text-center space-y-2 px-4">
                <div className="text-4xl" aria-hidden>
                  🚧
                </div>
                <p className="text-sm font-medium text-[var(--ds-color-text-primary)]">
                  {title}
                </p>
                <p className="text-xs text-[var(--ds-color-text-muted)]">
                  Pendiente — task{" "}
                  <span className="font-mono">{taskFile}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className={shell.specCard}>
            <h3 className={shell.specHeading}>Implementación</h3>
            <div className={shell.specDivider}>
              <p className="px-4 py-3 text-sm text-[var(--ds-color-text-muted)]">
                Vista objetivo:{" "}
                <span className="font-mono text-xs">{viewFile}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ControlsPanelFrame>
        <div className="p-6 space-y-4">
          <h2 className={shell.panelTitle}>Controls</h2>
          <p className="text-xs text-[var(--ds-color-text-muted)]">
            Los controles de variante se añadirán al implementar la molécula
            contra Figma MCP.
          </p>
          <div className={shell.configBox}>
            <div className={shell.configRow}>
              <span className={shell.configKey}>Task</span>
              <span className={shell.configValMono}>{taskFile}</span>
            </div>
            <div className={shell.configRow}>
              <span className={shell.configKey}>Ruta</span>
              <span className={shell.configValMono}>
                {catalog?.path ?? location.pathname}
              </span>
            </div>
          </div>
        </div>
      </ControlsPanelFrame>
    </div>
  );
}
