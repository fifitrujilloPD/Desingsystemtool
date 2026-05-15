import { useLocation } from "react-router";
import { getAtomCatalogByPath } from "../data/atom-catalog-routes";

export function PlaceholderView() {
  const location = useLocation();
  const catalog = getAtomCatalogByPath(location.pathname);
  const segment = location.pathname.split("/").filter(Boolean).pop() || "Page";
  const title =
    catalog?.label ??
    segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="text-center space-y-3 max-w-md px-4">
        <div className="text-5xl" aria-hidden>
          🚧
        </div>
        <h2 className="text-xl font-semibold text-[var(--ds-color-text-primary)]">
          {title}
        </h2>
        <p className="text-sm text-[var(--ds-color-text-muted)]">
          Este átomo está planificado en Feature 04. La implementación sigue la
          task{" "}
          <span className="font-mono text-xs">
            {catalog?.taskFile ?? "—"}
          </span>
          .
        </p>
      </div>
    </div>
  );
}
