import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "ds-controls-panel-expanded";

type ControlsPanelContextValue = {
  /** Panel de controles visible (ancho completo). */
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  toggle: () => void;
  /** Padding derecho del contenido principal (evita solaparse con el panel fijo). */
  contentPaddingClass: string;
};

const ControlsPanelContext = createContext<ControlsPanelContextValue | null>(
  null,
);

export function ControlsPanelProvider({ children }: { children: ReactNode }) {
  const [expanded, setExpandedState] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "0") setExpandedState(false);
      else if (raw === "1") setExpandedState(true);
    } catch {
      /* ignore */
    }
  }, []);

  const setExpanded = useCallback((value: boolean) => {
    setExpandedState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setExpandedState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo<ControlsPanelContextValue>(
    () => ({
      expanded,
      setExpanded,
      toggle,
      contentPaddingClass: expanded ? "pr-80" : "pr-12",
    }),
    [expanded, setExpanded, toggle],
  );

  return (
    <ControlsPanelContext.Provider value={value}>
      {children}
    </ControlsPanelContext.Provider>
  );
}

export function useControlsPanel(): ControlsPanelContextValue {
  const ctx = useContext(ControlsPanelContext);
  if (!ctx) {
    throw new Error(
      "useControlsPanel must be used within ControlsPanelProvider",
    );
  }
  return ctx;
}
