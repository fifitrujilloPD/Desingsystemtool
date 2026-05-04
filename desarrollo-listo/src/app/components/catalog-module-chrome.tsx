import { useLocation } from "react-router";
import { resolveNavModuleMeta } from "../nav/categories";

/**
 * Contenedor del catálogo: muestra módulo Atomic + título de página (Feature 02).
 * Estilos solo vía tokens semánticos (--ds-*) / theme.
 */
export function CatalogModuleChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const { atomicModule, pageTitle } = resolveNavModuleMeta(pathname);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="mb-6 border-b border-[var(--ds-color-border-default)] pb-3">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--ds-color-text-muted)]">
          {atomicModule}
        </p>
        <h2 className="mt-1 text-sm font-semibold text-[var(--ds-color-text-primary)]">
          {pageTitle}
        </h2>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
