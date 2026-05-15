import { Outlet } from "react-router";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { ControlsPanelProvider } from "./controls-panel-context";
import { CatalogModuleChrome } from "./catalog-module-chrome";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[var(--ds-color-surface-app)] transition-colors">
      <Navbar />
      <ControlsPanelProvider>
        <div className="flex">
          <Sidebar />
          <main className="mt-16 ml-64 flex min-h-0 flex-1 flex-col p-8 pt-4">
            <CatalogModuleChrome>
              <Outlet />
            </CatalogModuleChrome>
          </main>
        </div>
      </ControlsPanelProvider>
    </div>
  );
}